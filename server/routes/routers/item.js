const express = require('express');

const asyncHandler = require('../../middleware/async');
const {authorize,protect} = require('../../middleware/auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    const { users,item,subcategoryname } = db;
    app.post("/additem",asyncHandler(async(req,res,next)=>{
        item.create({
            itemname:req.body.itemname,
            unit:req.body.unit,
            price:req.body.price,
            category:req.body.category,
            userUserId:req.body.userId
            }).then((s,err)=>{
                if(err){
                    return res.status(400).send(err)
                }
                if(s){
                    let itemId=s.itemId;
                    let userId =req.body.userId;
                    let sub = req.body.subcategoryName;
                    sub.forEach(element => {
                        subcategoryname.create({
                            itemId:itemId,
                            subcategoryName:element

                        }).then((s)=>{
                            if(s){
                                return res.status(200).send("items added ")
                            }
                        })
                    });
                    
                }
            })
    }))

app.get("/vendormenuitem/:userId",asyncHandler(async(req,res,next)=>{
    await item.findAll({
        include:[{
            model:users,
            where:{userId:req.params.userId}
        }]
    }).then((s,err)=>{
        if(s){
           return res.status(200).send(s);
        }
        if(err){
            return res.status(500).send(err);
        }
    })
}))

app.get("/itemsubcategroy/:itemId",asyncHandler(async(req,res,next)=>{
    await subcategoryname.findAll({where:{itemId:req.params.itemId}}).then((s,err)=>{
        if(s){return res.status(200).send(s)
        };

        if(err){return res.status(500).send(err)}
        next();
    })
}))


app.delete("/deleteitem/:itemId",protect,asyncHandler(async(req,res,next)=>{
    let itemId= req.params.Id;
    await item.destroy({where:{itemId:itemId}}).then((s,err)=>{
        if(!s){res.status(500).send(err)}
        if(s){return res.send(200).send(s)}
    })
}))




}