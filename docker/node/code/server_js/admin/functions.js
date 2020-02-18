var _mysql = require("mysql");
var express = require("express");
var renderer = require("./../tools/renderer");

function loadListeners(app,permissions){
    app.get("/admin/panel*",async function(req,res){
        permissions.isAllowed(req,permissions.convertNode("pages.adminpanel.view"))
        .then(allow => {
            renderer.renderFile("admin/adminPanel.html",req,res);
        }).catch(nope =>{
            renderer.renderFile("status/none.html",req,res);
        });
    });
}
module.exports = {
    loadListeners:      loadListeners
}