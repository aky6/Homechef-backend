const express = require('express');

const asyncHandler = require('../../middleware/async');
const {authorize,protect} = require('../../middleware/auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    const { users,usercart } = db;
    app.post("/addtocart",asyncHandler(async(req,res,next)=>{
        try{
        let itemid = req.body.itemId;
        let userId =req.body.userId ;
        let quantity = req.body.quantity;

     const cart= await usercart.create({
        itemId:itemid,
        userUserId:userId,
        quantity:quantity
     })
         res.status(200).send(cart);
         next();
    }catch(err){
        res.status(500).send(err.parent["sqlMessage"])
    }
    }));

app.put("/updatecart",asyncHandler(async(req,res,next)=>{
        let quantity=req.body.quantity;
        try{
           await usercart.update({quantity:quantity},{where:{cartId:req.body.cartId}}).then((s)=>{
               if(!s){
                   return res.status(500).send(err)
               }else{
                   res.status(200).send(s);
                   next();
               }
           })
        }catch(err){
          res.status(500).send(err)
        }
    
    }))
app.get("/usercart/:userId",asyncHandler(async(req,res,next)=>{
    let Id=req.params.userId;
    try{   const user = await users.findOne({where:{userId:Id}})
    if(user){
    await usercart.findAll({where:{userUserId:Id}}).then((s)=>{
        if(!s){
            return res.status(404).send("errror ")
        }else{
            return res.status(200).send(s);
        }
        
    })
}}catch(err){
    res.status(500).send(err);
}
 
}))
app.delete("/usercartdelete/:cartId",asyncHandler(async(req,res,next)=>{
    let Id =req.params.cartId;
    usercart.findOne({where:{cartId:Id}}).then((s,err)=>{
        if(err){return res.status(400).send(err)}
        if(s){usercart.destroy({where:{cartId:Id}}).then((s)=>{
            if (!s){return res.status(500).send("error while deleteing")}
            else{return res.status(200).send("deleted ")}
        })}
    })
}))

}