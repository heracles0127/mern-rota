const express = require("express");
const User = require('./models/user.model');

module.exports = function(req,res,next) {
    if(req.url == "/basic/login"){
        next();
    }else{
        var token = req.headers['token']; 
        User.findOne({token:token},function(err,data){
            if(data == null){
                res.send('not access');
            }else{
                req.role = data.role
                next();
            }
        });
    }
}