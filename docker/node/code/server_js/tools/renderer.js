var express = require("express");
var _mysql = require("mysql");

function renderFile(file,req,res,permissions=false){
    res.locals.user = req.session.user;
    if(permissions != false){
        permissions.isAllowed(req,permissions.convertNode("pages.adminpanel.view"))
        .then(allowed => {
            res.locals.user.adminpanel = true;
            getFile(file,req,res);
        })
        .catch(nope => {
            res.locals.user.adminpanel = false;
            getFile(file,req,res);
        });
    }else{
        getFile(file,req,res);
    }
    
    
}

function getFile(file,req,res){
    res.render(file);
    res.end();
}

module.exports = {
    renderFile: renderFile
}