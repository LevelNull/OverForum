var _mysql = require("mysql");
var express = require("express");
var renderer = require("./../tools/renderer");
var config = require("./../../config/mysql");
var path = require("path");
var fs = require("fs");

module.exports = {
    startListeners:      startListeners,
    startDependencies:   startDependencies
}

function startListeners(app,permissions){
    
    app.get("/admin/panel",async function(req,res){
        permissions.isAllowed(req,"pages.adminpanel.view")
        .then(allow => {
            renderer.renderFile("admin/adminPanel.html",req,res);
        }).catch(nope =>{
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.get("/admin/adminPanel.js",async function(req,res){
        permissions.isAllowed(req,"pages.adminpanel.view")
        .then(yes =>{
            if(fs.existsSync(path.join(path.join(__dirname,"../../"),"web_js/admin/adminPanel.js"))){
                
                res.sendFile(path.join("web_js/admin/adminPanel.js"),{root: path.join(__dirname,"../../")});
            }else{
                renderer.renderFile("status/none.html",req,res,permissions,404);
            }
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.post("/admin/panel/permissions",async function(req,res){
        permissions.isAllowed(req,"server.permissions.list")
        .then(yes =>{
            var mysql = _mysql.createConnection(config.mysqlOptions);
            mysql.query(require("./../db/tables/permissions").getAll,async function(err,result,field){
                if(err != null){
                    res.json();
                    res.write("{'success': false,'message':'Database Error!'}");
                    res.end();
                    mysql.end();
                    return;
                }
                var data = {};
                headers = {
                    0: "Node",
                    1: "Description"
                }
                await result.forEach(perm => {
                    data[perm.node] = {"Node":perm.node,"Description": perm.name};
                });
                var tosend = {
                    success: true,
                    headers: headers,
                    data: data
                }
                res.json(tosend);
                mysql.end();
                return;
            });
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
}

function startDependencies(app,permissions){
    require("./groupManager").startListeners(app,permissions);
    require("./userManager").startListeners(app,permissions);
}
