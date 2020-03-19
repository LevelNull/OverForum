var express = require("express");
var _mysql = require("mysql");
var renderer = require("./tools/renderer");
var path = require("path");
var fs = require("fs");


async function setupApi(app,mysqlopts){
    return new Promise((resolve,reject)=>{
        require("../server_js/setup/firsttime").setupListener(
            app,
            mysqlopts,
            (goodResponse) => {
                resolve(goodResponse);
            },
            (badResponse) => {
                reject(badResponse);
            });
    });
}

function locations(app,permissions){
    
    app.get("/favicon.ico",function(req,res){
        res.status(501);
        res.end();
    });
    app.get("*.css",function(req,res){
        if(fs.existsSync(path.join(path.join(__dirname,"../"),path.join("css/",req.path)))){
            res.sendFile(path.join("css/",req.path),{root: path.join(__dirname,"../")});
        }else{
            renderer.renderFile("status/none.html",req,res,permissions,404);   
        }
    });
    app.get("*.js",function(req,res){
        if(fs.existsSync(path.join(path.join(__dirname,"../"),path.join("web_js/",req.path)))){
            res.sendFile(path.join("web_js/",req.path),{root: path.join(__dirname,"../")});
        }else{
            renderer.renderFile("status/none.html",req,res,permissions,404);
        }
    });
    app.get("*.png",function(req,res){
        if(fs.existsSync(path.join(path.join(__dirname,"../"),path.join("image/",req.path)))){
            res.sendFile(path.join("image/",req.path),{root: path.join(__dirname,"../")});
        }else{
            renderer.renderFile("status/none.html",req,res,permissions,404);
        }
    });
    app.get("/",function(req,res){
        renderer.renderFile("index.html",req,res,permissions);
    });
    app.get("/login",function(req,res){
        renderer.renderFile("auth/loginPage.html",req,res,permissions);
    });
    
    
}


function addFourOhFour(app,permissions){
    app.get("*",function(req,res){
        renderer.renderFile("status/none.html",req,res,permissions,404);
    });
}

function loadAll(app,permissions){
    //console.log(permissions)
    var mysql = require("./../config/settings").mysqlOptions;
    var setupListen = setupApi(app,mysql)
        .then(result => {
            if(result != false){
                console.log("Admin setup located at /setup/"+result);
                require("../server_js/setup/firsttime").startSetupListeners(app,mysql,result,permissions);
            }
            locations(app,permissions);
            addFourOhFour(app,permissions);
      }).catch(error =>{
        console.log(error);
      });
}
module.exports.loadAll = loadAll;
module.exports.locations = locations;
