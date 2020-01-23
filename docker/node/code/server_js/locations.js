var mysql = require("mysql");
var loginMan = require("./auth/loginManager");
var express = require("express");

function locations(app){
    app.get("/favicon.ico",function(req,res){
        res.status(400);
    });
    app.get("*.css",function(req,res){
        res.sendFile("/var/overforum/css/"+req.path);
    });
    app.get("*.js",function(req,res){
        res.sendFile("/var/overforum/web_js/"+req.path);
    });
    app.get("*.png",function(req,res){
        res.sendFile("/var/overforum/image/"+req.path);
    });
    app.get("/",function(req,res){
        renderFile("index.html",req,res);
    });
    app.get("/login",function(req,res){
        renderFile("auth/loginPage.html",req,res);
    });
    app.post("/submitlogin",function(req,res){
        app.use(express.json());
        if(loginMan.login(req.body)){
            
        }
    });
    app.get("*",function(req,res){
        renderFile("status/none.html",req,res);
    });
}
function renderFile(file,req,res){
    res.render(file);
}
module.exports.locations = locations;