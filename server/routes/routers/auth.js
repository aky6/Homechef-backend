const express = require('express');
const { Op, Sequelize } = require("sequelize");
const asyncHandler = require('../../middleware/async');
const { authorize, protect } = require('../../middleware/auth');
const bufferToString = require('../../../utils/convertBufferToStr');
let fileupload = require("express-fileupload");
const request = require('request');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const RzPayInstance = require('../../../utils/razorPay');
const { vendor } = require('../../config/db');
const crypto = require("crypto");
const moment = require("moment");
const rzPayInstance = require('../../../utils/razorPay');

const msg91 = require("msg91")("354089AxCVTI6fJ602592edP1", "HOMEMADE", "4");

cloudinary.config({
  cloud_name: "pullkart",
  api_key: '445382534171769',
  api_secret: "rEcZ_h_XBD-HYkVH7wabEIMHQhM"
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,


  // transformation: [{ width: 500, height: 500, crop: "limit" }]
})
const parser = multer({ storage: storage });

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/server/routes/routers/uploads/e/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

const uploadFile = multer({ storage: filestorage, fileFilter: excelFilter });



// Mobile No can be a single number, list or csv string


module.exports = (app, db) => {
  const { subcat, categoryname, customization, conatctUs, Admin, Invoice, sequelize, Dashboard, DeliveryPartner, item, image, location, notes, orderlist, payment, subcategoryname, usercart, users, vendor, review } = db;
  // register/signup
  app.post(
    '/register',
    asyncHandler(async (req, res, next) => {

      let firstname = req.body.firstname;
      let lastname = req.body.lastname;
      let email_Id = req.body.email_Id;
      let mobileNumber = req.body.mobileNumber;
      let password = req.body.password;

      console.log(firstname);
      console.log(lastname);
      console.log(mobileNumber);
      console.log(password);

      // hashing password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('This is the password', hashedPassword);
      try {
        const user = await users.create({
          firstname: firstname,
          lastname: lastname,
          email_Id: email_Id,
          mobileNumber: mobileNumber,
          password: hashedPassword,

        })
        sendTokenResponse(user, 200, res);

        next();
      } catch (err) {
        res.status(400).send(err)
      }

    })
  );
  app.post("/chefSignUp", asyncHandler(async (req, res, next) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email_Id = req.body.email_Id;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    let user_desc = req.body.user_desc;
    let Address = req.body.address;
    let city = req.body.city;
    let zip = req.body.zip;
    let state = req.body.state;
    let lat = req.body.lat;
    let long = req.body.long;
    let flatAddress = req.body.flatAddress


    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('This is the password', hashedPassword);
    try {
      vendor.create({
        firstname: firstName,
        lastname: lastName,
        email_Id: email_Id,
        mobileNumber: mobileNumber,
        user_desc: user_desc,
        password: hashedPassword,
        Address: Address,
        city: city,
        zip: zip,
        state: state,
        lat: lat,
        long: long

      }).then((s) => {
        console.log(s);
        if (s) {
          sendTokenResponse(s, 200, res);
        }

      })
    } catch (err) {
      res.status(400).send(err)
    }

  })
  );
  app.post("/AdminSignUp", asyncHandler(async (req, res, next) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email_Id = req.body.email_Id;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    let user_desc = req.body.user_desc;
    let Address = req.body.address;
    let city = req.body.city;
    let zip = req.body.zip;
    let state = req.body.state


    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('This is the password', hashedPassword);
    try {
      Admin.create({
        firstname: firstName,
        lastname: lastName,
        email_Id: email_Id,
        mobileNumber: mobileNumber,
        user_desc: user_desc,
        password: hashedPassword,
        Address: Address,
        city: city,
        zip: zip,
        state: state

      }).then((s) => {
        console.log(s);
        if (s) {
          sendTokenResponse(s, 200, res);
        }

      })
    } catch (err) {
      res.status(400).send(err)
    }

  })
  );
  app.post('/Adminlogin', async function (req, res, next) {
    const { email_Id, password } = req.body;

    //validation email and password
    if (!email_Id || !password) {
      return res.status(400).send("Please provide email and password");
    }

    Admin.findOne({ where: { email_Id } }).then((user) => {
      if (!user) {
        return res.status(400).send("Please provide email and password");
      }

      //check if password matchs
      //let hashedPassword = await bcrypt.hash(password, 10);
      bcrypt.compare(password, user.password).then((bool) => {
        if (bool == false) {
          return res.status(404).send("invalid password")
        }
        else {
          sendTokenResponse(user, 200, res);
        }
      })

    });



  });

  app.post('/cheflogin', async function (req, res, next) {
    const { email_Id, password } = req.body;

    //validation email and password
    if (!email_Id || !password) {
      return res.status(400).send("Please provide email and password");
    }

    vendor.findOne({ where: { email_Id } }).then((user) => {
      if (!user) {
        return res.status(400).send("Please provide email and password");
      }

      //check if password matchs
      //let hashedPassword = await bcrypt.hash(password, 10);
      bcrypt.compare(password, user.password).then((bool) => {
        if (bool == false) {
          return res.status(404).send("invalid password")
        }
        else {
          sendTokenResponse(user, 200, res);
        }
      })

    });



  });
  // login/signin

  app.post('/login', async function (req, res, next) {
    const { email_Id, password } = req.body;
    console.log(email_Id);
    //validation email and password
    if (!email_Id || !password) {
      return res.status(400).send("Please provide email and password");
    }

    users.findOne({ where: { email_Id: email_Id } }).then((user) => {
      if (!user) {
        return res.status(400).send("Please provide email and password");
      }
      console.log(user);
      //check if password matchs
      //let hashedPassword = await bcrypt.hash(password, 10);
      bcrypt.compare(password, user.password).then((bool) => {
        if (bool == false) {
          return res.status(404).send("invalid password")
        }
        else {
          sendTokenResponse(user, 200, res);
        }
      })

    });



  });

  // to see the logged user
  app.get(
    '/getLoggedInUser',
    asyncHandler(async (req, res, next) => {
      // user is already available in req due to the protect middleware
      const user = req.user;

      res.status(200).json({
        success: true,
        data: user,
      });
    })
  );

  //get token from model, create a cookie, send res
  const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    console.log(token);
    // persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });

    // if (process.env.NODE_ENV === 'production') {
    //   options.secure = true;
    // }

    res
      .status(statusCode)
      .cookie('token', token, { expire: new Date() + 9999 })
      .json({
        message: 'Succesful',
        token,
      });
  };

  // get a single user
  app.get('/user', function (req, res) {
    users
      .findAll({ where: { email_Id: req.params.email_Id } })
      .then((s) => {
        if (!exist) {
          res.json('no such user exists');
        }
        res.status(200).json({
          username,
          email_Id,
          imageId,
        });
      })
      .catch(function (err) {
        console.log('coming from error');
        res.json(err);
      });
  });
  app.get("/me", async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ e });
    }
  });
  app.put("/changepasword", async (req, res) => {
    try {
      let password = req.body.password;
      let Id = req.body.Id;
      let newpassword = req.body.newpassword;
      console.log(password);
      console.log(Id);
      console.log(newpassword);
      await users.findOne({ where: { userId: Id } }).then(async (s, err) => {
        console.log("enter");
        if (!s) {
          return res.status(404).send(err)
        }

        if (s) {

          let psd = s.password;
          console.log(psd);
          await bcrypt.compare(password, psd).then(async (bool) => {
            console.log(bool);
            if (bool == false) {
              return res.status(404).send("invalid password")
            }
            else {
              const hashedPassword = await bcrypt.hash(newpassword, 10);
              users.update(
                { password: hashedPassword },
                { where: { userId: Id } }
              )
                .then((s) => {
                  res.status(200).json({
                    message: 'password has been updated',
                  });
                });
            }
          })
        }
      })
    } catch (error) {
      res.status(400).send(error);
    }
  })

  app.get("/userlocation/:userid", async (req, res) => {
    users.findOne({ where: { userId: req.params.userid }, attributes: ['lat', 'long', 'Address'] }).then((data) => {
      return res.status(200).json({ data: data });
    }).catch((err) => {
      return res.status(500).json({ message: err });
    })
  })

  app.put("/userlocation", async (req, res) => {
    let userid = req.body.userId;
    let lat = req.body.lat;
    let long = req.body.lng;
    let locationDetails = req.body.address;
    users.update({ lat: lat, long: long, Address: locationDetails }, { where: { userId: userid } }).then((data) => {
      return res.status(200).json({ message: 'location updated successfully' });
    }).catch((err) => {
      return res.status(500).json({ message: err });
    });
  })

  app.put("/changestatusofvendor", async (req, res) => {
    let vendorId = req.body.vendorId;
    let statusy = req.body.status
    vendor.update({ status: statusy }, { where: { vendorId: vendorId } }).then((s) => {
      if (!s) { return res.status(500).send("gbhjknk") }
      else {
        vendor.findOne({ where: { vendorId: vendorId } }).then((v) => {
          return res.status(200).send(v)
        })
      }


    })
  })
  app.post("/additem", parser.array("image", 2), asyncHandler(async (req, res, next) => {
    //veg-npn veg omage
    console.log(req.files)
    console.log(req.body.image)
    console.log(typeof (req.body.image)) // to see what is returned to you
    // console.log(req.body.customization);
    // console.log(typeof (req.body.customization));
    // console.log((req.body.subcategoryName))
    let test = false

    item.create({
      itemname: req.body.itemname,
      unit: req.body.unit,
      price: req.body.price,
      category: req.body.category,
      VendorVendorId: req.body.vendorId,
      ingredients: req.body.ingredients,
      isVeg: req.body.isVeg,
      desc: req.body.desc,

      quantity: req.body.quantity,
      cooking_time: req.body.cookingTime,
      inStock: req.body.inStock,
      availabel_from: req.body.availableFrom,
      availabel_to: req.body.availableTill,
      dateofservice: req.body.dateOfServing,

    }).then(async (s, err) => {
      if (err) {
        return res.status(400).send(err)
      }
      if (s) {
        let itemId = s.itemId;
        let userId = req.body.userId;
        let sub = req.body.subcategoryName;
        let customize = req.body.customization
        let m = [];
        if (req.files) {
          let files = req.files
          console.log("files length", req.files.length);
          for (const file of files) {

            let url = file.path;


            await image.create({
              imagePath: url,
              itemItemId: itemId
            })
          }
        }
        await customize.forEach((e) => { m.push(JSON.parse(e)) })
        if (typeof (sub) === "undefined" || sub === null) { return res.status(200).send(s); }
        if (typeof (customize) === "undefined" || customize === null) { return res.status(200).send(s); }
        else {
          sub.map(element => {
            subcategoryname.create({
              itemItemId: itemId,
              subcategoryName: element

            }).then((sh) => {
              if (sh) {
                test = true
                // console.log("res.status(200).send()", test)

              }
            })
          });
          // console.log("customize", customize)
          // console.log("m", m)
          // console.log("customize", JSON.parse(customize))
          // let cgt = JSON.parse(customize)
          m.map((e) => {
            // console.log("e", e.name)
            // console.log("e", e.price)
            customization.create({
              Name: e.name,
              Price: e.price,
              itemItemId: itemId,
            }).then((es) => {
              if (es) {
                // console.log("Es", es)
              }
            })
          })
        }



        // console.log("test", test)
        return res.status(200).send(s);



      }
    })
  }))
  // app.post("/addimagetoitem", parser.sin)
  app.put("/updatevendor", parser.single("image"), async (req, res) => {
    let vendorId = req.body.vendorId;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let mobileNumber = req.body.mobileNumber;
    let user_desc = req.body.user_desc;
    let Address = req.body.Address;
    let status = req.body.status;
    let city = req.body.city;
    let zip = req.body.zip
    let state = req.body.state;
    let lat = req.body.lat;
    let long = req.body.long;
    let flatAddress = req.body.flatAddress;


    if (lat) {
      await vendor.update({ lat: lat }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (flatAddress) {

      await vendor.update({ flatAddress: flatAddress }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (long) {
      await vendor.update({ long: long }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (firstname) {
      await vendor.update({ firstname: firstname }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (lastname) {
      await vendor.update({ lastname: lastname }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (mobileNumber) {
      await vendor.update({ mobileNumber: mobileNumber }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (user_desc) {
      await vendor.update({ user_desc: user_desc }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if (Address) {
      await vendor.update({ Address: Address }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if ((status)) {
      await vendor.update({ status: status }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if ((city)) {
      await vendor.update({ city: city }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    } if ((zip)) {
      await vendor.update({ zip: zip }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if ((state)) {
      await vendor.update({ state: state }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    if ((req.file)) {
      let imagedata = {};
      imagedata.url = req.file.path;
      imagedata.id = req.file.public_id;
      await vendor.update({ imagePath: imagedata.url }, { where: { vendorId: vendorId } })
      console.log("imagedata")
    }
    return res.status(200).send("records updated");
  })
  app.put("/updateitem", parser.single("image"), async (req, res) => {
    try {
      console.log(JSON.stringify(req.body));
      let itemId = req.body.itemId;
      let itemname = req.body.itemname;
      let price = req.body.price;
      let category = req.body.category;
      let keyword = req.body.keyword;
      let isVeg = req.body.isVeg;
      let ingredients = req.body.ingredients;
      let unit = req.body.unit;
      let desc = req.body.desc;
      let quantity = req.body.quantity;
      let subcategoryName = req.body.subcategoryName;
      let cooking_time = req.body.cookingTime;
      let inStock = req.body.inStock;
      let availabel_from = req.body.availableFrom;
      let availabel_to = req.body.availableTill;
      let vendorId = req.body.vendorId;
      let dateofservice = req.body.dateOfServing;
      let customization = req.body.customization;
      if (dateofservice) {
        item.update({ dateofservice: dateofservice }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      if (cooking_time) {
        item.update({ cooking_time: cooking_time }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      if (inStock) {
        item.update({ inStock: inStock }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      if (availabel_from) {
        item.update({ availabel_from: availabel_from }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      if (availabel_to) {
        item.update({ availabel_to: availabel_to }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      console.log(req.file); // to see what is returned to you
      console.log(req.body.itemId);

      if (req.file) {
        let imagedata = {};
        imagedata.url = req.file.path;
        imagedata.id = req.file.public_id;
        item.update({ imagePath: imagedata.url }, { where: { itemid: itemId } })
        console.log("imagedata")
      }
      if (itemname) {
        item.update({ itemname: itemname }, { where: { itemid: itemId } })
        console.log("itemname");
      }
      if (unit) {
        item.update({ unit: unit }, { where: { itemid: itemId } })
      }
      if (price) {
        item.update({ price: price }, { where: { itemid: itemId } })
      }
      if (keyword) {
        item.update({ keyword: keyword }, { where: { itemid: itemId } })
      }
      if (category) {
        item.update({ category: category }, { where: { itemid: itemId } })
      }
      if (isVeg) {
        item.update({ isVeg: isVeg }, { where: { itemid: itemId } })
      }
      if (ingredients) {
        item.update({ ingredients: ingredients }, { where: { itemid: itemId } })
      }
      if (quantity) {
        item.update({ quantity: quantity }, { where: { itemid: itemId } })
      }
      if (desc) {
        item.update({ desc: desc }, { where: { itemid: itemId } })
      }
      if (subcategoryName) {
        let sub = subcategoryName.length;
        for (i = 0; i < sub; i++) {
          await subcategoryname.create({ subcategoryName: subcategoryName[i], itemItemId: itemId })
        }

      }

      return res.status(200).send("dataupdate")
    }
    catch (err) { return res.status(400).send(err) }

  })

  app.post("/uploadinbulk", uploadFile.single("file"), async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
      }

      let path = __basedir + "/server/routes/routers/uploads/e/" + req.file.filename;
      console.log(path);
      readXlsxFile(path).then((rows) => {
        // skip header
        rows.shift();

        let tutorials = [];

        rows.forEach(async (row) => {
          item.create({
            itemname: row[0],
            desc: row[2],
            isVeg: row[3],
            price: row[4],
            quantity: row[5],
            unit: row[6],
            VendorVendorId: req.body.vendorId
          }).then((s, err) => {
            if (s) {
              let itemId = s.id;
              console.log(itemId);
              subcategoryname.create({
                itemItemId: itemId,
                subcategoryName: row[1]
              }).then((r, err) => {
                if (r) { console.log(1) };
                if (err) { return res.status(400).send(err) }
              })
            } if (err) {
              return res.status(500).send(err);
            }
          })
            .catch((Err) => {
              return res.status(600).send(Err);
            })


        })
        return res.status(200).send("done")

        // item.bulkCreate(tutorials)
        //   .then((s) => {
        //     console.log(s);
        //     res.status(200).send({
        //       message: "Uploaded the file successfully: " + req.file.originalname,
        //     });
        //   })
        //   .catch((error) => {
        //     res.status(500).send({
        //       message: "Fail to import data into database!",
        //       error: error.message,
        //     });
        //   });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  })

  //get all the end user details to display in admin panel
  app.get("/userList/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      //console.log(pageNo);
      let userResults = await users.findAndCountAll({
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
        attributes: ['email_Id', 'firstname', 'userId', 'mobileNumber', 'imagePath', 'created_at']
      });
      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });

  //get all the end user details to display in admin panel
  app.get("/userList", async (req, res) => {
    try {
      let userResults = await users.findAll({
        order: [['created_at', 'DESC']],
        attributes: ['email_Id', 'firstname', 'userId', 'mobileNumber', 'imagePath', 'created_at']
      });
      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });
  app.get("/Newlyadded/:category/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      let category = req.params.category;
      //console.log(pageNo);
      let userResults = await subcategoryname.findAndCountAll({
        where: { subcategoryName: category },
        include: {
          model: item,
          attributes: ['itemname', 'imagePath', 'price', 'itemId']
        },
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
        attributes: ['subcategoryName']
      });
      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });

  app.get("/vendorList/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      //console.log(pageNo);
      let userResults = await vendor.findAndCountAll({
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
        attributes: ['email_Id', 'firstname', 'vendorId', 'status', 'mobileNumber', 'imagePath', 'created_at']
      });
      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });


  //get all the vendor details to display in admin panel
  app.get("/vendorList", async (req, res) => {
    try {
      let userResults = await vendor.findAll({
        order: [['created_at', 'DESC']],
        attributes: ['email_Id', 'firstname', 'vendorId', 'status', 'mobileNumber', 'imagePath', 'created_at']
      });
      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });


  app.get("/vendormenuitem/:userId", asyncHandler(async (req, res, next) => {
    await item.findAll({
      where: { VendorVendorId: req.params.userId }
    }).then((s, err) => {
      if (s) {
        return res.status(200).send(s);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  }))


  app.get("/vendormenuitemList/:vendorId/:pageNo", asyncHandler(async (req, res, next) => {
    try {
      let pageNo = Number(req.params.pageNo);
      let vendorId = req.params.vendorId;
      //console.log(pageNo);
      let vendorMenuResults = await item.findAndCountAll({
        order: [['created_at', 'DESC']], where: { VendorVendorId: vendorId }
        , limit: 12, offset: (pageNo - 1) * 12
      });
      return res.status(200).send(vendorMenuResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))

  app.post("/vendorMenuItemByCategoryList", asyncHandler(async (req, res, next) => {
    try {
      let pageNo = Number(req.body.pageNo);
      let vendorId = req.body.vendorId;
      let category = req.body.category;
      //console.log(pageNo);
      let vendorMenuResults = await item.findAndCountAll({
        order: [['created_at', 'DESC']],
        where: { [Op.and]: [{ VendorVendorId: vendorId }, { category: category }] }, limit: 12, offset: (pageNo - 1) * 12
      });
      return res.status(200).send(vendorMenuResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))


  app.get("/chefnearyou/:city", async (req, res) => {
    vendor.findAll({
      where: { city: req.params.city },
      include: {
        model: review,
        attributes: ['ratingscrore', 'review', 'reviewtitle'],
      }
    }).then((S) => {
      return res.send(S);
    })
  })
  app.get("/vendordeatils/:vendorId", async (req, res) => {
    vendor.findOne({ where: { vendorId: req.params.vendorId } }).then((s) => {
      if (typeof (s) === 'undefined') {
        return res.status(500).sned("No vendor with this Id")
      } else {

        return res.status(200).send(s);
      }
    })
  })

  app.get("/admindetails/:adminId", async (req, res) => {
    Admin.findOne({ where: { adminId: req.params.adminId } }).then((s) => {
      if (typeof (s) === 'undefined') {
        return res.status(500).send("No admin with this Id")
      } else {

        return res.status(200).send(s);
      }
    })
  })

  app.post("/addtocart", asyncHandler(async (req, res, next) => {
    try {
      let details = req.body.details;
      let userId = req.body.userId;



      //veg-npn veg omage

      console.log(userId);

      await usercart.create({

        userUserId: userId,
        details: details
      }).then((s) => {
        if (typeof s !== "undefined") {
          console.log(s);
          return res.status(200).send(s);
        } else {
          return res.status(500).send("problem")
        }
      })
    } catch (err) {
      res.status(500).send(err)
    }
  }));

  app.put("/updatecart", asyncHandler(async (req, res, next) => {

    let cartdata = req.body.cartdata;
    let len = cartdata.length;
    try {
      for (i = 0; i < len; i++) {
        let s = cartdata[i]["cartId"];
        let b = cartdata[i]["details"];
        await usercart.update({ details: b }, { where: { cartId: s } }).then((s) => {
          if (s) {
            console.log("updated")
          }
        })
      }
      return res.status(200).send("updated the cart");
    } catch (err) {
      return res.status(500).send(err);
    }

  }))

  app.put("/updateAddItemsInCart", asyncHandler(async (req, res, next) => {
    try {
      let itemsArray = req.body.details;
      let itemsSize = itemsArray.length;
      let userId = req.body.userId;
      // console.log(JSON.stringify(itemsArray));
      // update quantity of existing items in array
      let activeUserCartDetails = await usercart.findAll({ where: { [Op.and]: [{ userUserId: userId }, { status: 'Active' }] } });
      for (let cartDetail of activeUserCartDetails) {
        let cartItems = JSON.parse(cartDetail.details);
        for (let cartItem of cartItems) {
          let updItemIndex = itemsArray.findIndex((item) => item.itemId == cartItem.itemId);
          if (updItemIndex > -1) {
            cartItem.quantity += itemsArray[updItemIndex].quantity;
            itemsArray.splice(updItemIndex, 1);
          }
        }
        if (itemsArray.length == 0) {
          // console.log(JSON.stringify(cartItems));
          await usercart.update({ details: cartItems }, { where: { cartId: cartDetail.cartId } });
          return res.status(200).send({ message: 'cart items are updated/added successfully' });
        }
        else if (itemsArray.length < itemsSize) {
          itemsSize = itemsArray.length;
          // console.log(JSON.stringify(cartItems));
          await usercart.update({ details: cartItems }, { where: { cartId: cartDetail.cartId } });
        }
      }

      //add remaining items in a new cart
      if (itemsArray.length > 0) {
        let newUserCart = await usercart.create({ userUserId: userId, details: itemsArray });
      }

      return res.status(200).send({ message: 'cart items are updated/added successfully' });
    }
    catch (err) {
      res.status(500).send(err);
    }
  }))

  app.post("/usercartcheck", asyncHandler(async (req, res, next) => {
    let Id = req.body.userId;
    let itemarray = req.body.items;
    let arr = [];
    usercart.findAll({
      where:
      {
        [Op.and]: [
          { userUserId: Id },
          { status: 'Active' }
        ]
      }, attributes: ['details']
    }).then((s, err) => {
      if (s && s.length > 0) {
        //console.log(s);
        let itemIDArr = [];
        for (let cartItems of s) {
          let records = JSON.parse(cartItems.details);
          // console.log(JSON.stringify(records));
          let arrrecord = records.map(value => value.itemId);
          for (let ele of arrrecord) {
            itemIDArr.push(ele);
          }
          // console.log(JSON.stringify(itemIDArr));
        }
        let intersection = itemIDArr.filter(itemid => itemarray.includes(itemid));
        // console.log(intersection)
        let l = intersection.length;
        if (l > 0) {
          return res.status(200).send(" already present in cart ");
        } else {
          return res.status(204).send("no identical item in cart");
        }

      }
      return res.status(204).send("no identical item in cart");
    })
  }))

  app.get("/usercart/:userId", asyncHandler(async (req, res, next) => {
    let Id = req.params.userId;
    console.log(Id);

    usercart.findAll({
      where: {
        [Op.and]: [
          { userUserId: Id },
          { status: 'Active' }
        ]


      },
    }).then(async (s) => {
      console.log(s);
      if (!s) {
        return res.status(404).send("errror")
      } else {
        let len = s.length;
        console.log(len);
        for (i = 0; i < len; i++) {
          let eme = s[i]["itemItemId"];
          await item.findAll({ where: { itemId: eme }, attributes: ['imagePath'] }).then((su) => {
            console.log(su);
          })

        }
        let itemId = s.ite
        return res.status(200).send(s);
      }

    })


  }))

  app.put("/removesingleitemfromcart", asyncHandler(async (req, res, next) => {
    let Id = req.body.cartId;
    let itemId = req.body.itemId;
    usercart.findAll({ where: { cartId: Id } }).then((s, err) => {
      if (s) {
        // console.log(s);
        let records = JSON.parse((s.map(result => result.details))[0]);
        // console.log("records : ", JSON.stringify(records));
        let index = records.findIndex(x => x.itemId === itemId);
        records.splice(index, 1);
        // console.log("records after ",records);
        if (records.length > 0) {
          usercart.update({ details: records }, { where: { cartId: Id } }).then((s, err) => {
            if (s) {
              return res.status(200).send("item removed");
            }
            else {
              return res.status(500).send(err);
            }
          })
        }
        else {
          //if no other items are there in cart delete the cart instead of leaving an empty one
          usercart.destroy({ where: { cartId: Id } }).then((s) => {
            if (!s) { return res.status(500).send("error while deleteing") }
            else { return res.status(200).send("item removed") }
          })
        }

      }
      else {
        return res.status(500).send(err);
      }
    })
  }))

  app.delete("/usercartdelete/:cartId", asyncHandler(async (req, res, next) => {
    let Id = req.params.cartId;
    usercart.findOne({ where: { cartId: Id } }).then((s, err) => {
      if (err) { return res.status(400).send(err) }
      if (s) {
        usercart.destroy({ where: { cartId: Id } }).then((s) => {
          if (!s) { return res.status(500).send("error while deleteing") }
          else { return res.status(200).send("deleted ") }
        })
      }
    })
  }))

  app.get("/countitemincart/:userId", asyncHandler(async (req, res) => {
    let Id = req.params.userId;
    await usercart.findAll({
      where:
      {
        [Op.and]: [
          { userUserId: Id },
          { status: 'Active' }
        ]
      }, attributes: ['details']
    }).then((s, err) => {
      if (s && s.length > 0) {

        let itemIDArr = [];
        for (let cartItems of s) {
          let records = JSON.parse(cartItems.details);
          let arrrecord = records.map(value => value.itemId);
          for (let ele of arrrecord) {
            itemIDArr.push(ele);
          }
        }
        let l = itemIDArr.length;
        console.log(l);

        return res.status(200).json(l);
      }
      else {
        return res.status(200).json(0);
      }

      if (err) {
        return res.status(400).send(err);
      }
    })
  }))

  app.get("/states", asyncHandler(async (req, res) => {
    let s = ["Andhra Pradesh (AP)", "Arunachal Pradesh (AR)", "Assam (AS)", "Bihar (BR)", "Chhattisgarh (CG)", "Goa (GA)", "Gujarat (GJ)", "Haryana (HR)", "Himachal Pradesh (HP)", "Jharkhand (JH)", "Karnataka (KA)", "Kerala (KL)", "Madhya Pradesh (MP)", "Maharashtra (MH)", "Manipur (MN)", "Meghalaya (ML)", "Mizoram (MZ)", "Nagaland (NL)", "Odisha (OR)", "Punjab (PB)", "Rajasthan (RJ)", "Sikkim (SK)", "Tamil Nadu (TN)", "Telangana (TG)", "Tripura (TR)", "Uttar Pradesh (UP)", "Uttarakhand (UK)", "West Bengal (WB)"
      , "Andaman and Nicobar Islands (AN)", "Chandigarh (CH)", "Dadra and Nagar Haveli (DN)", "Daman and Diu (DD)", "Delhi (National Capital Territory) (DL)", "Jammu and Kashmir (JK)", "Ladakh (JK)", " Lakshadweep (LD)", "Puducherry (PY)"]
    res.send(s);


  }))

  app.delete('/deleteall', asyncHandler(async (req, res) => {
    item.destroy({
      where: {},


    }).then(() => { res.send("done") })
  }))

  app.get("/userdetails/:userId", async (req, res) => {
    users.findOne({ where: { userId: req.params.userId } }).then((s) => {
      if (s) {
        return res.status(200).send(s);
      } if (!s) {
        return res.status(500).send("not found")
      }
    })
  })

  app.get("/itemsubcategroy/:itemId", asyncHandler(async (req, res, next) => {
    let x = req.params.itemId;
    await subcategoryname.findAndCountAll({
      where: { itemItemId: req.params.itemId },
      include: {
        model: item,
        required: true,
        include: {
          model: vendor,
          required: true,
          where: {
            city: "Noida",
            accountstatus: "Active"
          }

        }
      }
    }).then((s, err) => {
      if (s) {
        return res.status(200).send(s)
      };

      if (err) { return res.status(500).send(err) }
      next();
    })
  }))
  app.get("/itembysubcategoryName/:name", asyncHandler(async (req, res, next) => {
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    try {
      console.log("reqheaders", req.headers);
      let name = req.params.name;
      // let pageno = req.params.pageno;
      // { [Op.like]: `%${name}%`}
      // let s = await sequelize.query(
      //   'SELECT DISTINCT Dashboards.itemname,Dashboards.itemItemId,Dashboards.price,Dashboards.itemquantity,item.imagePath FROM Dashboards INNER JOIN item ON Dashboards.itemItemId=item.itemId ORDER BY Dashboards.itemquantity  ASC',
      //   {
      //     replacements: ['Dashboards.itemquantity', 'desc'],
      //     type: sequelize.QueryTypes.SELECT,
      //   }
      // );
      let subcategoryResults = await subcategoryname.findAndCountAll({
        where: { subcategoryName: { [Op.like]: `%${name}%` } },
        include: {
          model: item,
          required: true,
          attributes: ['itemname', 'imagePath', 'price', 'itemId'],
          include: {
            model: vendor,
            required: true,
            where: { city: city }
          }
        },
        order: [['created_at', 'DESC']],
        attributes: ['subcategoryName']
      });
      // console.log(subcategoryResults);
      let subcategoryItemsDetail = {
        count: subcategoryResults.count,
        rows: subcategoryResults.rows
      };

      return res.status(200).send(subcategoryItemsDetail);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))
  app.get("/itembysubcategoryName/:name/:pageno", asyncHandler(async (req, res, next) => {
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    try {
      let name = req.params.name;
      let pageno = req.params.pageno;
      let subcategoryResults = await subcategoryname.findAndCountAll({
        order: [['created_at', 'DESC']], where: { subcategoryName: { [Op.like]: `%${name}%` } },
        limit: 8, offset: (pageno - 1) * 8
      });
      // console.log(subcategoryResults);
      let subcategoryItemsDetail = {
        count: subcategoryResults.count,
        rows: []
      };
      for (let i = 0; i < subcategoryResults.rows.length; i++) {
        let itemDet = await item.findOne({
          where: { itemId: subcategoryResults.rows[i].itemItemId },
          include: {
            model: vendor,
            where: { city: city, accountstatus: "Active" },
            required: true
          },
          attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
        });
        subcategoryItemsDetail.rows.splice(0, 0, itemDet);
      }
      return res.status(200).send(subcategoryItemsDetail);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))

  app.delete("/deleteitem/:itemId", asyncHandler(async (req, res, next) => {
    let itemId = req.params.itemId;
    console.log(itemId);
    await item.destroy({ where: { itemId: itemId } }).then((s, err) => {
      console.log(s);
      if (!s) { return res.status(500).send(err) }
      if (s) { return res.send(200).send(s) }
    })
  }))

  app.post('/uploaditemimage', parser.single("image"), (req, res) => {
    console.log(req.file) // to see what is returned to you
    console.log(req.body.itemId);
    let imagedata = {};
    imagedata.url = req.file.path;
    imagedata.id = req.file.public_id;
    console.log(imagedata);
    image.create({
      imagePath: imagedata.url,
      itemId: req.body.itemId

    }).then((s, err) => {
      if (err) { return res.status(500).send(err) }
      if (s) { return res.status(200).send(s) }
    })
      .catch((err) => {
        return res.status(500).send(err)
      })
  });

  app.put("/updateitemimage", parser.single("image"), (req, res) => {
    let imagedata = {};
    imagedata.path = req.file.path;
    imagedata.id = req.file.public_id;
    console.log(imagedata.path);
    image.update({ imagePath: imagedata.path }, { where: { itemId: req.body.itemId } })
      .then((s, err) => {
        if (s) { return res.status(200).send(s) }
        if (err) { return res.status(500).send(err) }
      })
      .catch((err) => { return res.status(404).send(err) })
  })

  app.get("/itemimage/:itemId", (req, res) => {
    image.findAll(({ where: { itemId: req.params.itemId } }))
      .then((s, err) => {
        if (!s) { return res.status(404).send("no such item") }
        if (s) {
          return res.status(200).send(s)
        }
      })
      .catch((err) => { return res.status(500).send(err) })

  })

  app.put("/updateuserdetails", async (req, res) => {
    try {
      let firstname = req.body.firstname;
      let userId = req.body.userId;
      let mobileNumber = req.body.mobilenumber;
      let user_desc = req.body.desc;

      if (firstname) {
        await users.update({ firstname: firstname }, { where: { userId: req.body.userId } })
      }
      if (mobileNumber) {
        await users.update({ mobileNumber: mobileNumber }, { where: { userId: req.body.userId } })
      }
      if (user_desc) {
        await users.update({ user_desc: user_desc }, { where: { userId: req.body.userId } })
      }


      return res.status(200).send("records updated")
    } catch (err) {
      return res.status(400).send(err);
    }
  })

  app.post("/addlocation", async (req, res) => {
    let userId = req.body.userId;
    let address = req.body.address;
    let lat = req.body.lat;
    let long = req.body.long;
    let city = req.body.city;
    let zip = req.body.zip;
    let state = req.body.state;
    location.create({
      userUserId: userId,
      address: address,
      state: state,
      zip: zip,
      lat: lat,
      long: long,
      city: city
    }).then((s) => {
      if (s) { return res.status(200).send(s) }
      else { return res.status(500).send("err while adding") }
    })

  })
  app.get("/useraddress/:userId", async (req, res) => {
    location.findAll({ where: { userUserId: req.params.userId } }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(404).send(err) }
    })
  })

  app.put('/vendorprofileimageupload', parser.single("image"), async (req, res) => {
    console.log(req.file) // to see what is returned to you
    console.log(req.body.vendorId);
    let imagedata = {};
    imagedata.url = req.file.path;
    imagedata.id = req.file.public_id;
    console.log(imagedata);
    vendor.update({ imagePath: imagedata.url }, { where: { vendorId: req.body.vendorId } }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(500).send(err) }
    })
      .catch((err) => {
        return res.status(404).send(err)
      })
  })

  app.get('/getuserimage/:userId', asyncHandler(async (req, res, next) => {
    users.findAll({
      where: {
        userId: req.params.userId
      },
      attributes: ['imagePath'],
    }).then(function (s) {
      if (!s) { return res.status(400).send("no such user") }
      res.status(200).json(list);
    })

  }))

  app.get("/itemdetails/:itemId", asyncHandler(async (req, res) => {
    let id = req.params.itemId; console.log(id);
    ; item.findOne({
      where: { itemId: req.params.itemId }, include: [{
        model: subcategoryname

      }, {
        model: customization

      }]
    }).then((s) => {
      // console.log(s);
      if (typeof (s) === "undefined" || s === null) {
        return res.status(404).json("not found");
      } else {
        return res.status(200).send(s);
      }
    })
  }))

  app.put("/userupdateprofileimage", parser.single("image"), (req, res) => {
    let imagedata = {};
    imagedata.path = req.file.path;
    imagedata.id = req.file.public_id;
    console.log(imagedata.path);
    users.update({ imagePath: imagedata.path }, { where: { userId: req.body.userId } })
      .then((s, err) => {
        if (s) { return res.status(200).send(s) }
        if (err) { return res.status(500).send(err) }
      })
      .catch((err) => { return res.status(404).send(err) })
  })

  app.post("/customerorder", async (req, res) => {
    try {
      //1: create Homemade OrderId
      let orderResults = await orderlist.create({
        itemList: req.body.itemList,
        address: req.body.Address,
        TotalPrice: req.body.TotalPrice,
        userUserId: req.body.userId,
        VendorVendorId: req.body.vendorId,
        buyername: req.body.buyername
      });

      if (orderResults !== "undefined") {
        let mob = await vendor.findOne({ where: { vendorId: req.body.vendorId }, attributes: ["mobileNumber"] })
        let message = `You got a order from ${req.body.buyername}`;
        request.get(`http://164.52.195.161/API/SendMsg.aspx?uname=20210092&pass=29S5999Q&send=SMSINF&dest=${mob}&msg=${message}&priority=1`);
      }

      //2: Get userDetails to add to razorpay order
      let userResults = await users.findOne({ where: { userId: req.body.userId } });
      // console.log(JSON.stringify(userResults));

      //3: Add the order details to razor pay notes for reference
      let rzPayNotes = {
        userName: userResults.firstname,
        email: userResults.email_Id
      };
      for (let i = 0; i < orderResults.itemList.length; i++) {
        rzPayNotes['item' + i] = `itemName: ${orderResults.itemList[i].Name},
        quantity: ${orderResults.itemList[i].quantity},
        price: ${orderResults.itemList[i].Price}`;
      }
      // console.log(JSON.stringify(rzPayNotes));

      let rzPayOrderResults = await RzPayInstance.orders.create({
        amount: orderResults.TotalPrice * 100, //In Paisa
        currency: 'INR',
        payment_capture: 0,
        receipt: orderResults.orderId,
        notes: rzPayNotes
      });


      //4: Store the delivery partner details of the order
      let deliveryDetails = await DeliveryPartner.create({
        DeliveryPartner: req.body.deliverypartner,
        cost: req.body.deliveryprice,
        location: req.body.deliverylocation,
        VendorVendorId: req.body.vendorId,
        orderlistOrderId: orderResults.orderId
      });
      console.log('price' + req.body.deliveryprice);

      //5 : update RazorPay order id in order table
      await orderlist.update({ rzPayOrderId: rzPayOrderResults.id }, { where: { orderId: orderResults.orderId } });

      //5: The order details are stored for dashbaord
      for (let i = 0; i < orderResults.itemList.length; i++) {
        await Dashboard.create({
          VendorVendorId: req.body.vendorId,
          itemname: orderResults.itemList[i]["Name"],
          itemItemId: orderResults.itemList[i]["itemId"],
          price: orderResults.itemList[i]["Price"],
          itemquantity: orderResults.itemList[i]["quantity"]
        });
      }

      return res.status(200).send({
        data: { rzPayOrderId: rzPayOrderResults.id, orderId: orderResults.orderId },
        message: "your order is placed"
      });

    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  })

  app.post("/verifypayment", async (req, res) => {
    try {
      let rzPayOrderId = req.body.rzPayOrderId;
      let orderId = req.body.orderId;
      let rzPayPaymentId = req.body.rzPayPaymentId;
      let rzsignature = req.body.rzsignature;
      let userId = req.body.userId;

      // console.log(JSON.stringify(req.body));
      const hmac = crypto.createHmac('sha256', '2MKvC6xQkDXGrcmnKFu3P5iX');
      hmac.update(rzPayOrderId + "|" + rzPayPaymentId);
      let generatedSignature = hmac.digest('hex');

      //GET payment details from razorPay
      let rzPaymentDetails = await RzPayInstance.payments.fetch(rzPayPaymentId);
      // console.log(JSON.stringify(rzPaymentDetails));

      //store payment details in table
      let paymentResults = await payment.create({
        rzPayPaymentId: rzPaymentDetails.id,
        PaymentDesc: rzPaymentDetails.description,
        paymentamount: rzPaymentDetails.amount / 100,
        paymentStatus: rzPaymentDetails.status,
        PaymentMethod: rzPaymentDetails.method,
        orderlistOrderId: orderId
      });
      // console.log(JSON.stringify(paymentResults));

      if (generatedSignature == rzsignature && rzPaymentDetails.status == 'authorized') {

        //get the order details
        let rzPayOrderResults = await RzPayInstance.orders.fetch(rzPayOrderId);

        //capture the payment manually
        await RzPayInstance.payments.capture(rzPayPaymentId, rzPayOrderResults.amount, rzPayOrderResults.currency);

        //GET payment details from razorPay
        rzPaymentDetails = await RzPayInstance.payments.fetch(rzPayPaymentId);
        // console.log(JSON.stringify(rzPaymentDetails));

        //update status of payment to captured in payment table
        await payment.update({ paymentStatus: rzPaymentDetails.status }, { where: { paymentId: paymentResults.paymentId } });

        //update status of usercart to completed
        await usercart.update({ status: "completed" }, { where: { [Op.and]: [{ userUserId: userId }, { status: 'Active' }] } });


        return res.status(200).send({ message: "payment is captured" });
      }
      else {
        return res.status(400).send({ message: "payment is not captured" });
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  })

  app.post("/errorpayment", async (req, res) => {
    try {
      let rzPayOrderId = req.body.rzPayOrderId;
      let orderId = req.body.orderId;
      let rzPayPaymentId = req.body.rzPayPaymentId;
      let userId = req.body.userId;
      let error = req.body.error;

      let errorDesc = `code : ${error.code}, description : ${error.description}, source : ${error.source},
      step : ${error.step}, reason : ${error.reason}`;

      // console.log(errorDesc);
      //GET error payment details from razorPay
      let rzPaymentDetails = await RzPayInstance.payments.fetch(rzPayPaymentId);
      // console.log(JSON.stringify(rzPaymentDetails));

      //store error payment details in table
      let paymentResults = await payment.create({
        rzPayPaymentId: rzPaymentDetails.id,
        PaymentDesc: errorDesc,
        paymentamount: rzPaymentDetails.amount / 100,
        paymentStatus: rzPaymentDetails.status,
        PaymentMethod: rzPaymentDetails.method,
        orderlistOrderId: orderId
      });

      return res.status(200).send({ message: "error payment is logged" });
    }
    catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  })

  app.post("/refundpayment", async (req, res) => {
    try {
      let orderId = req.body.orderId;

      //1: Get order details from payment table
      let paymentDetails = await payment.findOne({ where: { orderlistOrderId: req.body.orderId } });

      //2: Initiate a refund for the payment
      if (paymentDetails.rzPayPaymentId) {
        let rzPayResults = await RzPayInstance.payments.refund(paymentDetails.rzPayPaymentId,
          { amount: paymentDetails.paymentamount, notes: paymentDetails.PaymentDesc });
        return res.status(200).json(rzPayResults);
      }
      else {
        return res.status(400).json({ message: 'The order doesnt have an associated payment' });
      }
    }
    catch (err) {
      return res.status(500).send(err);
    }
  })

  app.post("/checkcancelledpaymentstatus", async (req, res) => {
    try {

      return res.status(200).send({ message: "ignore as payment not done" });
    }
    catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  })

  app.get("/bestseller", async (req, res) => {
    // best seller logic needs to change order by is not working as of now

    let s = await sequelize.query(
      'SELECT DISTINCT Dashboards.itemname,Dashboards.itemItemId,Dashboards.price,Dashboards.itemquantity,item.imagePath FROM Dashboards INNER JOIN item ON Dashboards.itemItemId=item.itemId ORDER BY Dashboards.itemquantity  ASC',
      {
        replacements: ['Dashboards.itemquantity', 'desc'],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).send(s);
  })
  app.put("/updateorderstatusbychef", (req, res) => {

    orderlist.update({ orderStatus: req.body.status }, { where: { Id: req.body.orderId } })
      .then((s) => {
        console.log(s);

        if (s == 1) {

          let mob = orderlist.findOne({
            where: { Id: req.body.orderId }, include: {
              model: users,
              attributes: ['mobileNumber']
            }
          })
          let message = "your order is being cooked  " + req.body.status;
          request.get(`http://164.52.195.161/API/SendMsg.aspx?uname=20210092&pass=29S5999Q&send=SMSINF&dest=${mob}&msg=${message}&priority=1`)
          return res.status(200).send("status changed to    " + req.body.status)
        }
        else { return res.status(500).send("status can not be changed to  ") }
      })
      .catch((err) => { return res.status(400).send(err) })
  })

  app.get("/userorder/:userId", (req, res) => {
    orderlist.findAll({
      where: {
        userUserId: req.params.userId
      }
    }).then((s) => {
      if (s != 0) { return res.status(200).send(s) }
      else { return res.status(404).send("no orderfoung") }
    })
      .catch((err) => {
        return res.status(400).send(err)
      })
  })

  //get all the end user details to display in admin panel
  app.get("/userOrderList/:userId/:pageno/:items?", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      let userId = req.params.userId;
      let items = Number(req.params.items);
      if (!items) {
        items = 6;
      }
      //console.log(pageNo);
      let userOrderResults = await orderlist.findAndCountAll({
        order: [['created_at', 'DESC']], where: { userUserId: userId }
        , limit: items, offset: (pageNo - 1) * items
      });
      return res.status(200).send(userOrderResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  });

  app.get("/getimages/:orderlistId", (req, res) => {
    let Id = req.params.orderlistId;
    orderlist.findAll({ where: { Id: Id } }).then((s) => {
      return res.status(200).send(S);
    }).catch((err) => {
      return res.status(400).send(err);
    });
  });

  app.get("/orderdetails/:orderId", ((req, res) => {
    // console.log(req.params.orderId);
    orderlist.findOne({ where: { Id: req.params.orderId } }).then((S) => {
      //console.log(S);
      return res.status(200).send(S);
    }).catch((err) => {
      return res.status(400).send(err);
    })
  }))

  app.get("/vendororder/:vendorId", (req, res) => {
    orderlist.findAll({ where: { VendorVendorId: req.params.vendorId } }).then((s) => {
      if (s != 0) { return res.status(200).send(s) }
      else { return res.status(404).send("no ordering") }
    })
      .catch((err) => {
        return res.status(400).send(err)
      })
  })
  app.get("/vendor/:itemId", (req, res) => {
    item.findAll(
      {
        where: { itemId: req.params.itemId }
        , attributes: ["VendorVendorId"]
      }
    ).then((s) => {
      if (typeof s === 'undefined') {
        return res.status(500).send("no such item")
      } else {

        let ls = s.VendorVendorId;
        const records = s.map(result => result.dataValues)
        console.log(records[0]["VendorVendorId"]);
        return res.status(200).json({ "vendorId": records[0]["VendorVendorId"] });
      }
    })
  })
  app.post("/review", (req, res) => {
    review.create({
      userUserId: req.body.userId,
      VendorVendorId: req.body.vendorId,
      itemItemId: req.body.itemId,
      review: req.body.review,
      ratingscrore: req.body.ratingscrore,
      reviewtitle: req.body.reviewtitle
    }).then((s) => {
      return res.status(200).send(s);
    }).catch((err) => {
      return res.status(500).send(err)
    })
  })
  app.get("/review/:vendorId", (req, res) => {
    review.findAll({
      where: { VendorVendorId: req.params.vendorId },
      include: {
        model: users,
        attributes: ['firstname', 'lastname', 'imagePath']
      }


    })
      .then((s) => {
        if (s != 0) { return res.status(200).send(s) }
        else { return res.status(404).send("no review") }
      })
      .catch((err) => {
        return res.status(500).send(err)
      })
  })
  app.get("/alluserreview/:userId", (req, res) => {

    review.findAll({
      where: { userUserId: req.params.userId },
      include: {
        model: users,
        attributes: ['firstname', 'lastname', 'imagePath']
      }

    })
      .then((s) => {
        if (s != 0) { return res.status(200).send(s) }
        else { return res.status(404).send("no orderfoung") }
      })
      .catch((err) => {
        return res.status(500).send(err)
      })
  })

  app.get("/foodpage", async (req, res) => {
    // let city =req.headers.Location["city"]

    // console.log("city",(req.headers.location));
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    // console.log("city",city)
    try {
      let Breakfast = [];
      let NorthIndian = [];
      let Continental = [];
      let Oriental = [];
      let Desserts = [];
      let Platter = [];
      let SouthIndian = [];
      let Beverages = [];
      // let Meal = [];
      let Healthy = [];
      let Regional = [];
      //  let Biscuits=[];
      let Snacks = [];


      //Meal
      await subcategoryname.findAll({ where: { subcategoryName: "Healthy" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s);
          let len = s.length;
          // console.log(s);


          console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme },
              include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            console.log(l)

            Healthy.splice(0, 0, l);

            // console.log(arr);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "Beverages" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s);
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            Beverages.splice(0, 0, l);

            // console.log(arr);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "South Indian" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s);
          let len = s.length;
          // console.log(s);


          console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            SouthIndian.splice(0, 0, l);

            // console.log(arr);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({
        where: { subcategoryName: "Breakfast" }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, limit: 4
      }).then(async (s) => {
        if (s !== null) {
          // res.send(s);
          let len = s.length;
          //console.log(s);


          console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            Breakfast.splice(0, 0, l);

            // console.log(arr);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "North Indian" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            NorthIndian.splice(0, 0, l);

            // console.log(arr1);
          }
          //  res.send(arr)
        }
      })
      // Continental Oriental Desserts Breakfast  North Indian
      await subcategoryname.findAll({ where: { subcategoryName: "Continental" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            Continental.splice(0, 0, l);

            // console.log(arr2);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "Oriental" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            Oriental.splice(0, 0, l);

            // console.log(arr3);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "Desserts" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            //  console.log(l)
            Desserts.splice(0, 0, l);

            // console.log(arr4);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "Regional" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            console.log(l)
            Regional.splice(0, 0, l);

            // console.log(arr6);
          }
          //  res.send(arr)
        }
      })
      await subcategoryname.findAll({ where: { subcategoryName: "Platter" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            console.log(l)
            Platter.splice(0, 0, l);

            // console.log(arr6);
          }
          //  res.send(arr)
        }
      })
      // await subcategoryname.findAll({ where: { subcategoryName: "Biscuits" }, limit: 4 }).then(async (s) => {
      //   if (s !== null) {
      //     // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
      //     let len = s.length;
      //     // console.log(s);


      //     // console.log(len);
      //     for (i = 0; i < len; i++) {
      //       // console.log(s[i]["itemItemId"]);
      //       let eme = s[i]["itemItemId"];
      //       let l = await item.findOne({ where: { itemId: eme }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath'] })
      //       console.log(l)
      //       Biscuits.splice(0, 0, l);

      //       // console.log(arr6);
      //     }
      //     //  res.send(arr)
      //   }
      // })
      await subcategoryname.findAll({ where: { subcategoryName: "Snacks" }, limit: 4 }).then(async (s) => {
        if (s !== null) {
          // res.send(s) Continental Oriental Desserts Breakfast  North Indian;
          let len = s.length;
          // console.log(s);


          // console.log(len);
          for (i = 0; i < len; i++) {
            // console.log(s[i]["itemItemId"]);
            let eme = s[i]["itemItemId"];
            let l = await item.findOne({
              where: { itemId: eme }, include: {
                model: vendor,
                required: true,
                where: {
                  city: city,
                  accountstatus: "Active"
                }


              }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
            })
            console.log(l)
            Snacks.splice(0, 0, l);

            // console.log(arr6);
          }
          //  res.send(arr)
        }
      })


      let D = {};
      D.Breakfast = Breakfast;
      D.Platter = Platter;
      D.Desserts = Desserts;
      D.Oriental = Oriental;
      D.Continental = Continental;
      D.NorthIndian = NorthIndian;
      D.SouthIndian = SouthIndian;
      D.Beverages = Beverages;
      // D.Biscuits = Biscuits;
      D.Healthy = Healthy;
      D.Regional = Regional;
      D.Snacks = Snacks;
      res.status(200).send(D);
    } catch (err) {
      res.status(500).send(err)
    }
  })

  app.get("/sugarSpicesPage", asyncHandler(async (req, res, next) => {
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    try {
      let BakeryItems = [];
      let Chocolates = [];
      let Savories = [];
      let JamsSpreads = [];
      let SpicesPickles = [];

      //For Subcategory Bakery Items
      let bakeryResults = await subcategoryname.findAll({ where: { subcategoryName: "Bakery Items" }, attributes: ['itemItemId'], limit: 4 });
      bakeryResults = bakeryResults.map((item) => item.itemItemId);
      BakeryItems = await item.findAll({
        where: { itemId: { [Op.in]: bakeryResults } }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
      });

      //For Subcategory Chocolates
      let chocolateResults = await subcategoryname.findAll({ where: { subcategoryName: "Chocolates" }, attributes: ['itemItemId'], limit: 4 });
      chocolateResults = chocolateResults.map((item) => item.itemItemId);
      Chocolates = await item.findAll({
        where: { itemId: { [Op.in]: chocolateResults } }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
      });


      //For Subcategory Savories
      let savoriesResults = await subcategoryname.findAll({ where: { subcategoryName: "Savories" }, attributes: ['itemItemId'], limit: 4 });
      savoriesResults = savoriesResults.map((item) => item.itemItemId);
      Savories = await item.findAll({
        where: { itemId: { [Op.in]: savoriesResults } }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
      });

      //For Subcategory Jams & Spreads
      let JamsSpreadsResults = await subcategoryname.findAll({ where: { subcategoryName: "Jams & Spreads" }, attributes: ['itemItemId'], limit: 4 });
      JamsSpreadsResults = JamsSpreadsResults.map((item) => item.itemItemId);
      JamsSpreads = await item.findAll({
        where: { itemId: { [Op.in]: JamsSpreadsResults } }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
      });

      //For Subcategory Spices & Pickles
      let SpicesPicklesResults = await subcategoryname.findAll({ where: { subcategoryName: "Spices & Pickles" }, attributes: ['itemItemId'], limit: 4 });
      SpicesPicklesResults = SpicesPicklesResults.map((item) => item.itemItemId);
      SpicesPickles = await item.findAll({
        where: { itemId: { [Op.in]: SpicesPicklesResults } }, include: {
          model: item,
          required: true,
          include: {
            model: vendor,
            required: true,
            where: {
              city: city,
              accountstatus: "Active"
            }

          }
        }, attributes: ['itemId', 'price', 'itemname', 'VendorVendorId', 'imagePath']
      });

      let result = {
        BakeryItems,
        Chocolates,
        Savories,
        JamsSpreads,
        SpicesPickles
      };
      return res.status(200).send(result);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))

  app.get("/recentorderapi/:userId", (async (req, res) => {
    let arr = [];
    let Id = []; let g;
    orderlist.findAll({ where: { userUserId: req.params.userId }, attributes: ["itemList"], limit: 5 }).then(async (s) => {
      if (s) {
        let records = s.map(result => result.dataValues)
        records.forEach(element => {
          arr.push(JSON.parse(element["itemList"])[0])

        })
        let value = arr.map(a => a.ItemId);
        console.log(value);
        for (i = 0; i < value.length; i++) {
          let v = value[i];
          console.log(i);
          await item.findOne({ where: { itemId: v }, attributes: ["itemId", "imagePath", "itemname", "price", "VendorVendorId"] }).then((l, err) => {
            if (l) {
              //  console.log(l["dataValues"]);


              //  let h=l.map(result => result.dataValues)
              Id.push(l["dataValues"]);
              console.log(Id);
            };
            if (err) { return res.send(err) }
          })
        }
        // console.log(l);
        return res.status(200).send(Id);
      }

    })

  }))

  app.put("/updateaddress", async (req, res) => {
    let state = req.body.state;
    let address = req.body.address;
    let city = req.body.city;
    let zip = req.body.zip;
    let lat = req.body.lat;
    let long = req.body.long;
    let topicId = req.body.Id;
    if (state) {
      await location.update({ state: state }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }
    if (address) {
      await location.update({ address: address }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }
    if (city) {
      await location.update({ city: city }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }

    if (zip) {
      await location.update({ zip: zip }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }
    if (lat) {
      await location.update({ lat: lat }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }
    if (long) {
      await location.update({ long: long }, { where: { topicId: topicId } }).then((s, err) => {
        if (err) { return res.status(400).send(err) }
      })
    }
    return res.status(200).send("address updated")
  })

  app.delete("/deleteaddress/:Id", async (req, res) => {
    location.destroy({
      where: { topicId: req.params.Id }
    }).then((s, err) => {
      if (s) { return res.status(200).send("address removed") }
      if (err) { return res.status(404).send(err) }
    })
  })
  app.get("/food", (async (req, res) => {
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    item.findAll({
      where: { category: "food" },
      include: {
        model: vendor,
        required: true,
        where: {
          city: city,
          accountstatus: "Active"
        }

      }
      , attributes: ["itemname", "imagePath", "price", "VendorVendorId", "itemId"], limit: 4
    }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(400).send(err) }
    })
  }))
  app.get("/sugerandspices", (async (req, res) => {
    let obj = JSON.parse(req.headers.location);
    console.log(obj["city"])
    let city = obj["city"]
    item.findAll({
      where: { category: "Sugar & Spices" }, include: {
        model: vendor,
        required: true,
        where: {
          city: city,
          accountstatus: "Active"
        }

      }, attributes: ["itemname", "imagePath", "price", "VendorVendorId", "itemId"], limit: 4
    }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(400).send(err) }
    })
  }))
  app.post("/itemreview", async (req, res) => {
    review.create({
      userUserId: req.body.userId,
      itemItemId: req.body.itemId,
      review: req.body.review,
      ratingscrore: req.body.ratingscrore,
      reviewtitle: req.body.reviewtitle

    }).then((s) => {
      return res.status(200).send(s);
    }).catch((err) => {
      return res.status(500).send(err)
    })
  })
  app.get("/itemreview/:itemId", async (req, res) => {
    review.findAll({
      where: { itemItemId: req.params.itemId },
      include: [{
        model: users,
        attributes: ['firstname', 'lastname', 'imagePath'],
        required: true
      }]
    })
      .then((s) => {
        if (s != 0) { return res.status(200).send(s) }
        else { return res.status(404).send("no review") }
      })
      .catch((err) => {
        return res.status(500).send(err)
      })
  })
  app.get("/vendorsimilarProducts/:userId", asyncHandler(async (req, res, next) => {
    await item.findAll({
      where: { VendorVendorId: req.params.userId }, limit: 6
    }).then((s, err) => {
      if (s) {
        return res.status(200).send(s);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  }))
  app.get("/chefdeatils/:chefId", async (req, res) => {
    vendor.findAll(({
      where: { vendorId: req.params.chefId },
      include: [{
        model: item,
        required: true
      }]
    })).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(400).send(err) }
    })
  })
  app.get("/recentorder/:vendorId", async (req, res) => {
    let status = "orderPlaced"
    orderlist.findAll({
      where: {
        VendorVendorId: req.params.vendorId,
        orderStatus: status
      }, limit: 10
    }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(500).send(err) }
    })
  })
  app.get("/pending/:vendorId", (req, res) => {
    let status = "AcceptedByChef"
    orderlist.findAll({
      where: {
        VendorVendorId: req.params.vendorId,
        orderStatus: status
      }, limit: 10
    }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(500).send(err) }
    })
  })
  app.get("/pendingorderList/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      let status = "AcceptedByChef";
      let userResults = await orderlist.findAndCountAll({ where: { orderStatus: status } }, {
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
      });

      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }

  })

  app.get("/recentorderList/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);
      let status = "orderPlaced";
      let userResults = await orderlist.findAndCountAll({
        where: { orderStatus: status }, include: {
          model: users,
          attributes: ['firstname', 'mobileNumber', 'Address', 'email_Id']
        },
      }, {
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
      });

      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }

  })
  app.get("/historyorderList/:pageno", async (req, res) => {
    try {
      let pageNo = Number(req.params.pageno);

      let userResults = await orderlist.findAndCountAll({
        order: [['created_at', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,
      });

      return res.status(200).send(userResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }

  })
  app.put("/changeorderstatus", async (req, res) => {
    let status = req.body.status;
    let Id = req.body.orderId;
    orderlist.update({ orderStatus: status }, { where: { Id: Id } }).then((S, err) => {
      if (S) {
        return res.status(200).send("status change to " + status);
      }
      if (err) {
        return res.status(404).send(err)
      }
    })
  })
  app.put("/vendorstatuschange", async (req, res) => {
    let vendorId = req.body.Id;
    let accountstatus = req.body.status;
    vendor.update({ accountstatus: accountstatus }, { where: { vendorId: vendorId } }).then((s, err) => {
      if (s) { return res.status(200).send(s) }
      if (err) { return res.status(400).send(err) }
    })
  })

  app.get("/byname/:name", async (req, res) => {
    let query = req.params.name;
    let result = {}
    await item.findAll({ where: { itemname: { [Op.like]: `%${query}%` } } }).then((s, err) => {
      if (typeof s == "undefined" || typeof s == null) {
        console.log("no item");
      } else {
        result.item = s
      }
      if (err) {
        res.send(err);
      }
    })
    await subcategoryname.findAll({ where: { subcategoryName: { [Op.like]: `%${query}%` } } }).then((s, err) => {
      if (typeof s == "undefined" || typeof s == null) {
        console.log("no item");
      } else {
        result.subcategoryname = s
      }
    })
    await vendor.findAll({ where: { firstname: { [Op.like]: `%${query}%` } }, attributes: ['firstname', 'lastname', 'vendorId'] }).then((s) => {
      if (typeof s == "undefined" || typeof s == null) {
        console.log("no vendor");
      } else {
        result.vendorname = s
      }
    })
    return res.status(200).send(result);

  })

  app.get("/popularcuisine/:pageno", async (req, res) => {
    let pageNo = Number(req.params.pageno);
    //console.log(pageNo);
    let userResults = await Dashboard.findAndCountAll({
      include: {
        model: item,
        attributes: ['itemname', 'imagePath', 'price']
      },
      order: [['itemquantity', 'ASC']], limit: 5, offset: (pageNo - 1) * 5,
    });
    return res.status(200).send(userResults);




  })

  app.get("/vendorbestselling/:vendorId/:pageno", async (req, res) => {
    let vendorId = req.params.vendorId;

    let pageNo = Number(req.params.pageno);
    let dashboardresults = await Dashboard.findAndCountAll({
      where: { VendorVendorId: vendorId },
      include: [{ model: item, attributes: ['itemname', 'imagePath', 'price'] }],
      order: [['itemquantity', 'DESC']], limit: 5, offset: (pageNo - 1) * 5,

    })
    return res.status(200).send(dashboardresults);
  })

  app.get("/totalorders", (req, res) => {
    orderlist.count().then((s) => {
      if (s) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
    })
  })

  app.get("/totaldeliveredorderbyVendor/:vendorId", (req, res) => {
    let vendorId = req.params.vendorId;
    orderlist.count({ where: { [Op.and]: [{ orderStatus: "DeliveredtoCustomer" }, { VendorVendorId: vendorId }] } }).then((s, err) => {
      if (!err) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  })

  app.get("/totaldeliveredorder", (req, res) => {
    orderlist.count({ where: { orderStatus: "DeliveredtoCustomer" } }).then((s, err) => {
      if (!err) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  })

  app.get("/totalcancelledorderbyvendor/:vendorId", (req, res) => {
    let vendorId = req.params.vendorId;
    orderlist.count({ where: { [Op.and]: [{ orderStatus: "RejectedBychef" }, { VendorVendorId: vendorId }] } }).then((s, err) => {
      if (!err) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  })

  app.get("/totalcancelledorder", (req, res) => {
    orderlist.count({ where: { orderStatus: "RejectedBychef" } }).then((s, err) => {
      if (!err) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  })


  app.get("/totalrevenuebyvendor/:vendorId", (req, res) => {
    let vendorId = req.params.vendorId;
    orderlist.findAll({
      where: { VendorVendorId: vendorId },
      attributes: [[sequelize.fn('sum', sequelize.col('TotalPrice')), 'total']],
      raw: true,
    }).then((s, err) => {
      if (!err) {
        console.log(s);
        return res.status(200).send(s);
      }
      if (err) {
        return res.status(500).send(err);
      }
    })
  })

  app.get("/totalrevenue", (req, res) => {
    orderlist.findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('TotalPrice')), 'total']],

      raw: true,
    }).then((s) => {

      // console.log(r);
      return res.status(200).send(s);
    })
  })


  app.post("/invoice", (req, res) => {
    Invoice.create({

      customerName: req.body.name,
      invoice_date: req.body.date,
      amount: req.body.amount,
      orderId: req.body.orderId,
      VendorVendorId: req.body.vendorId,


    }).then((S) => {
      return res.status(200).send(S)
    }).catch((err) => {
      return res.status(500).send(err)
    })
  })
  app.get("/getallInvoice", (req, res) => {
    Invoice.findAll().then((S) => {
      return res.status(200).send(S)
    })
  })
  app.post('/invoicebyvendor', (req, res) => {

    Invoice.create({

      customerName: req.body.name,
      invoice_date: req.body.date,
      amount: req.body.amount,
      orderId: req.body.orderId,
      VendorVendorId: req.body.vendorId,
      type: "vendor"
    }).then((S) => {
      return res.status(200).send(S)
    }).catch((err) => {
      return res.status(500).send(err)
    })
  })
  app.get("invoiceofvendor/:vendorId", (req, res) => {
    Invoice.findAndCountAll({ where: { VendorVendorId: req.params.vendorId, type: "vendor" } }).then((s) => {
      return res.status(200).send(S)
    }).catch((err) => {
      return res.status(400).send(err)
    })
  })
  app.post("/contactUs", (req, res) => {
    conatctUs.create({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    }).then((s) => {
      return res.status(200).send(s)
    }).catch((s) => {
      return res.status(200).send(s)
    })

  })
  app.get("/contactform", (req, res) => {
    conatctUs.findAll().then((S) => {
      return res.status(200).send(S)
    }).catch((err) => {
      return res.status(400).send(err)
    })
  })

  app.get("/totalcustomers", (req, res) => {
    users.count().then((s) => {
      if (s) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
    })
  })

  app.get("/totalvendors", (req, res) => {
    vendor.count().then((s) => {
      if (s) {
        let r = (s).toString();
        console.log(r);
        return res.status(200).send(r);
      }
    })
  })

  app.get("/recentorderapi", (async (req, res) => {
    try {
      let orderResults = await orderlist.findAll({
        order: [['created_at', 'DESC']], limit: 5
      });
      return res.status(200).send(orderResults);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }));

  app.get("/searchCustomerByName/:username", (async (req, res) => {
    try {
      let userResult = await users.findAll({ where: { firstname: { [Op.like]: `%${req.params.username}%` } } });
      return res.status(200).send(userResult);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }));

  app.get("/searchVendorByName/:username", (async (req, res) => {
    try {
      let userResult = await vendor.findAll({ where: { firstname: { [Op.like]: `%${req.params.username}%` } } });
      return res.status(200).send(userResult);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }));

  app.delete("/deleteusers", asyncHandler(async (req, res, next) => {
    try {
      let UserIds = req.body.userId;
      await users.destroy({ where: { userId: { [Op.in]: UserIds } } });
      return res.status(200).json({ message: 'deleted successfully' });
    }
    catch (err) {
      return res.status(500).json(err);
    }
  }))

  app.delete("/deletevendors", asyncHandler(async (req, res, next) => {
    try {
      let VendorIds = req.body.vendorId;
      await vendor.destroy({ where: { vendorId: { [Op.in]: VendorIds } } });
      return res.status(200).json({ message: 'deleted successfully' });
    }
    catch (err) {
      return res.status(500).json(err);
    }
  }))
  app.get("/salesbymonth/:vendorId/:date", async (req, res) => {
    let fromDate = (moment(req.params.date, 'YYYY-MM-DD')).format('YYYY/MM/DD')
    console.log("fromDate", fromDate);
    let toDate = moment(fromDate.add(1, 'months')).format('YYYY/MM/DD')

    console.log("toDate", toDate);
    let vendorId = req.params.vendorId
    let r = await orderlist.findAll({
      where: {
        VendorVendorId: vendorId,
        [Op.and]: [
          sequelize.where(sequelize.fn('Date', sequelize.col('created_at')), '>=', fromDate),
          sequelize.where(sequelize.fn('Date', sequelize.col('created_at')), '<=', toDate),
        ]
      },
      attributes: [
        'VendorVendorId',
        [sequelize.fn('sum', sequelize.col('TotalPrice')), 'total_amount'],
      ],

      group: ["VendorVendorId"]
    })
    console.log(r);
    res.send(r)

  })
  app.get("/itembysubcategory/:name", asyncHandler(async (req, res, next) => {
    try {
      console.log("reqheaders", req.headers);
      let name = req.params.name;
      // let pageno = req.params.pageno;
      // { [Op.like]: `%${name}%`}
      //  let s = await sequelize.query(
      //    'SELECT DISTINCT Dashboards.itemname,Dashboards.itemItemId,Dashboards.price,Dashboards.itemquantity,item.imagePath FROM Dashboards INNER JOIN item ON Dashboards.itemItemId=item.itemId ORDER BY Dashboards.itemquantity  ASC',
      //    {
      //      replacements: ['Dashboards.itemquantity', 'desc'],
      //      type: sequelize.QueryTypes.SELECT,
      //    }
      //  );
      let subcategoryResults = await item.findAndCountAll({
        include: {
          model: subcategoryname,
          required: true,
          where: {
            subcategoryName: { [Op.like]: `%${name}%` }
          },
          DISTINCT: true,
          attributes: ['subcategoryName']

        },
        order: [['created_at', 'DESC']],
        attributes: ['itemname', 'imagePath', 'price', 'itemId']
      });

      //  console.log(subcategoryResults);
      let subcategoryItemsDetail = {
        count: subcategoryResults.count,
        rows: subcategoryResults.rows
      };

      return res.status(200).send(subcategoryItemsDetail);
    }
    catch (err) {
      return res.status(500).send(err);
    }
  }))

  app.get("/categorywithsubcategory", asyncHandler(async (req, res, next) => {
    categoryname.findAll({
      include: [{
        model: subcat
      }]
    }).then((s, err) => {
      if (s) {
        return res.status(200).send(s)
      }

    })
  }))
  app.post("/categorywithsubcategory", asyncHandler(async (req, res, next) => {
    let cat = req.body.category
    let subcats = req.body.subcategory
    console.log("subcat", subcat, subcat.length)
    categoryname.create({
      categoryName: cat
    }).then(async (s, err) => {
      if (s) {
        let categoryId = s.Id
        let promise = subcats.map((e) => {
          subcat.create({
            categoryId: categoryId,
            subcategoryName: e
          })
        })
        await Promise.resolve(promise).then((v, err) => {
          if (v) {
            return res.status(200).send(s)
          }
        })
      }
    })
  }
  ))
  app.get("/allcategory", asyncHandler(async (req, res, next) => {
    categoryname.findAll().then((s, err) => {
      return res.status(200).send(s)
    })
  }))
  app.get("/allsubcategory", asyncHandler(async (req, res, next) => {
    subcat.findAll().then((s, err) => {
      // console.log("s,", s)
      return res.status(200).send(s)
    })
  }))
};
