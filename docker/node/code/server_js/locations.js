var express = require("express");
var _mysql = require("mysql");
var renderer = require("./tools/renderer");


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
        renderer.renderFile("index.html",req,res);
    });
    app.get("/login",function(req,res){
        renderer.renderFile("auth/loginPage.html",req,res);
    });
    
    
}


function addFourOhFour(app){
    app.get("*",function(req,res){
        //console.log("serve 404");
        renderer.renderFile("status/none.html",req,res);
    });
}

function loadAll(app){
    var mysql = require("./../config/settings").mysqlOptions;
    var setupListen = setupApi(app,mysql)
        .then(result => {
            if(result != false){
                console.log("Admin setup located at /setup/"+result);
                require("../server_js/setup/firsttime").startSetupListeners(app,mysql,result);
            }
            locations(app,mysql);
            addFourOhFour(app);
      }).catch(error =>{
        console.log(error);
      });
}
module.exports.loadAll = loadAll;
module.exports.locations = locations;
