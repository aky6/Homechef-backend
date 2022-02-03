const express = require('express');
const { Op, Sequelize } = require("sequelize");
const axios = require('axios');
const createAuthRefreshInterceptor = require('axios-auth-refresh');
const geolib = require('geolib');
const users = require('../../models/users');

module.exports = (app, db) => {
    const { vendor, Invoice, orderlist, DeliveryPartner, users } = db;

    // Function that will be called to refresh authorization
    const refreshAuthLogic = (failedRequest) => {
        process.env.DUNZO_TOKEN = undefined;
        //  // console.log('Token Expired');
        getToken().then(tokenRefreshResponse => {
            failedRequest.response.config.headers['Authorization'] = tokenRefreshResponse;
            //  // console.log(tokenRefreshResponse);
            return Promise.resolve();
        });
    }

    // Instantiate the interceptor (you can chain it as it returns the axios instance)
    createAuthRefreshInterceptor.default(axios, refreshAuthLogic);

    const getToken = async () => {
        try {
            if (process.env.DUNZO_TOKEN) {
                return process.env.DUNZO_TOKEN;
            }
            else {
                let response = await axios.get(`${process.env.DUNZO_PROD_URL}/token`, {
                    skipAuthRefresh: true,
                    headers: {
                        "client-id": process.env.DUNZO_PROD_CLIENT_ID,
                        "client-secret": process.env.DUNZO_PROD_CLIENT_SECRET,
                        "Content-Type": "application/json",
                        "Accept-Language": "en_US"
                    }
                });
                process.env.DUNZO_TOKEN = response.data.token;
                return process.env.DUNZO_TOKEN;
            }
        }
        catch (err) {
            throw err;
        }
    }

    const calculateDeliveryChargeUsingDunzo = async (req, res, vendorLocation, userLocation) => {
        try {
            let result = await getToken();
            //  // console.log(JSON.stringify(vendorLocation) + ':' + JSON.stringify(userLocation));
            if (result.error) {
                return res.status(result.error.status).json(result.error.message);
            }
            else {
                let token = result;
                let response = await axios.get(`${process.env.DUNZO_PROD_URL}/quote`, {
                    headers: {
                        "client-id": process.env.DUNZO_PROD_CLIENT_ID,
                        "Authorization": token,
                        "Content-Type": "application/json",
                        "Accept-Language": "en_US"
                    },
                    params: {
                        'pickup_lat': Number(vendorLocation.lat),
                        'pickup_lng': Number(vendorLocation.long),
                        'drop_lat': userLocation.lat,
                        'drop_lng': userLocation.lng,
                        'category_id': 'pickup_drop'
                    }
                });
                if (response.data.distance > 8) {
                    return res.status(400).json({ message: 'distance is greater than 8 kms' })
                }
                return res.status(200).json({
                    partner: 'Dunzo',
                    price: response.data.estimated_price,
                    location: {
                        pickup: {
                            lat: Number(vendorLocation.lat),
                            lng: Number(vendorLocation.long),
                        },
                        drop: {
                            lat: userLocation.lat,
                            lng: userLocation.lng,
                        }
                    }
                });
            }
        }
        catch (err) {
            throw err;
        }
    }

    const calculateDistanceUsingLatLong = async (req, res, vendorLocation, userLocation) => {
        let distInMetres = geolib.getPreciseDistance(
            { latitude: vendorLocation.lat, longitude: vendorLocation.long },
            { latitude: userLocation.lat, longitude: userLocation.lng }
        );
        let distInKms = geolib.convertDistance(distInMetres, 'km');
        return distInKms;
    }

    app.post("/deliverycharges", async (req, res) => {
        try {
            //Get Lat long details on vendor
            let vendorId = req.body.vendorId;
            let vendorLocation = await vendor.findOne({ where: { vendorId: vendorId }, attributes: ['lat', 'long'] });
            let userLocation = JSON.parse(req.headers.location);
            if (!vendorLocation.lat || !vendorLocation.long) {
                return res.status(400).json({ message: 'The vendor Location is not set' });
            }
            if (!userLocation.lat || !userLocation.lng || !userLocation.city) {
                return res.status(400).json({ message: 'The User Location is not set' });
            }
            if (userLocation.city == 'Gurugram' || userLocation.city == 'Gurugaon') {
                await calculateDeliveryChargeUsingDunzo(req, res, vendorLocation, userLocation);
            }
            else if (userLocation.city == 'Noida') {
                let estimated_price = 0;
                let distance = await calculateDistanceUsingLatLong(req, res, vendorLocation, userLocation) + 0.6;
                if (distance <= 4) {
                    estimated_price = 40;
                }
                else if (distance <= 8) {
                    estimated_price = 40 + (Math.round(distance - 4) * 10);
                }
                else {
                    return res.status(400).json({ message: 'distance is greater than 8 kms' });
                }
                return res.status(200).json({
                    partner: 'Homemade',
                    price: estimated_price,
                    location: {
                        pickup: {
                            lat: Number(vendorLocation.lat),
                            lng: Number(vendorLocation.long),
                        },
                        drop: {
                            lat: userLocation.lat,
                            lng: userLocation.lng,
                        }
                    }
                });
            }
        }
        catch (err) {
            if (err.response) {
                let message = { 'code': err.response.data.code, 'message': err.response.data.message };
                return res.status(err.response.status).json(message);
            }
            else {
                return res.status(500).json(err);
            }
        }
    })

    app.post("/deliverorder", async (req, res) => {
        try {

            //1: change order status to cookingcompleted
            await orderlist.update({ orderStatus: 'cookingcompleted' }, { where: { Id: req.body.orderId } });
            let orderResults = await orderlist.findOne({ where: { Id: req.body.orderId } });
            //  // console.log('orders' + JSON.stringify(orderResults));
            let orderDeliveryAddress = JSON.parse(orderResults.address);

            //2: Get Vendor details
            let vendorDetails = await vendor.findOne({ where: { vendorId: req.body.vendorId } });
            //  // console.log('vendors' + JSON.stringify(vendorDetails));

            //3: Get user details
            let userDetails = await users.findOne({ where: { userId: orderResults.userUserId } })
            //  // console.log('users' + JSON.stringify(userDetails));

            //3: create invoice for vendor
            await Invoice.create({
                customerName: userDetails.firstname,
                invoice_date: new Date(),
                amount: orderResults.TotalPrice,
                orderId: req.body.orderId,
                VendorVendorId: req.body.vendorId,
                type: "vendor"
            });

            //4: Get delivery details
            let deliveryDetails = await DeliveryPartner.findOne({ where: { orderlistOrderId: req.body.orderId } });
            let location = JSON.parse(deliveryDetails.location);
            //  // console.log('deliveryDetails' + JSON.stringify(deliveryDetails));

            //5: frame JSON body for post
            let data = {
                'request_id': deliveryDetails.DeliveryId,
                'pickup_details': {
                    'lat': location.pickup.lat,
                    'lng': location.pickup.lng,
                    'address': {
                        'apartment_address': vendorDetails.Address,
                        'street_address_1': vendorDetails.Address,
                        'city': vendorDetails.city,
                        'state': vendorDetails.state,
                        'pincode': vendorDetails.zip,
                        'country': 'India'
                    }
                },
                'drop_details': {
                    'lat': location.drop.lat,
                    'lng': location.drop.lng,
                    'address': {
                        'apartment_address': orderDeliveryAddress.address,
                        'street_address_1': orderDeliveryAddress.address,
                        'city': orderDeliveryAddress.city,
                        'state': orderDeliveryAddress.state,
                        'pincode': orderDeliveryAddress.pinCode,
                        'country': 'India'
                    }
                },
                'sender_details': {
                    'name': vendorDetails.firstname,
                    'phone_number': vendorDetails.mobileNumber
                },
                'receiver_details': {
                    'name': userDetails.firstname,
                    'phone_number': userDetails.mobileNumber
                },
                'otp_required': true,
                'package_content': ['Food | Flowers'],
                'package_approx_value': Number(orderResults.TotalPrice),
                'special_instructions': 'Food items. Handle with great care!!'
            };
            //  // console.log(JSON.stringify(data));

            //6: For Delivery Partner Dunzo create a task
            if (deliveryDetails.DeliveryPartner == 'Dunzo') {
                let token = await getToken();
                let dunzoTaskDetails = await axios.post(`${process.env.DUNZO_PROD_URL}/tasks`, data, {
                    headers: {
                        "client-id": process.env.DUNZO_PROD_CLIENT_ID,
                        "Authorization": token,
                        "Content-Type": "application/json",
                        "Accept-Language": "en_US"
                    }
                });
                //  // console.log(JSON.stringify(dunzoTaskDetails));
                //7: update Dunzo Id and status in delivery table
                let orderResults = await DeliveryPartner.update({ partnerStatus: dunzoTaskDetails.data.state, DeliveryRefId: dunzoTaskDetails.data.task_id },
                    { where: { orderlistOrderId: req.body.orderId } });
            }
            return res.status(200).json({ message: 'delivery placed successfully' });

        }
        catch (err) {
            if (err.response) {
                let message = { 'code': err.response.data.code, 'message': err.response.data.message };
                return res.status(err.response.status).json(message);
            }
            else {
                return res.status(500).json(err);
            }
        }
    });
}