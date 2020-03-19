var _mysql = require("mysql");
var express = require("express");
var renderer = require("./../tools/renderer");
var config = require("./../../config/mysql");

function loadListeners(app,permissions){
    app.get("/admin/panel*",async function(req,res){
        permissions.isAllowed(req,"pages.adminpanel.view")
        .then(allow => {
            renderer.renderFile("admin/adminPanel.html",req,res);
        }).catch(nope =>{
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.post("/admin/panel/users",async function(req,res){
        permissions.isAllowed(req,"server.users.list")
        .then(yes =>{
            var mysql = _mysql.createConnection(config.mysqlOptions);
            mysql.query(require("./../db/tables/users").getUserListLimited,[0],async function(err,result,field){
                if(err != null){
                    res.json();
                    res.write("{'success': false,'message':'Database Error!'}");
                    res.end();
                    mysql.end();
                    return;
                }
                var data = {};
                var tosend = {
                    success: true,
                }
                await result.forEach(user => {
                    data[user.username] = {"Firstname: ": user.firstname,"Surname: ": user.lastname};
                });
                tosend["data"] = data;
                res.json();
                res.write(JSON.stringify(tosend));
                res.end();
                mysql.end();
                return;
            });
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res);
        });
    });
    app.post("/admin/panel/groups",async function(req,res){
        permissions.isAllowed(req,"server.groups.list")
        .then(yes =>{
            var mysql = _mysql.createConnection(config.mysqlOptions);
            mysql.query(require("./../db/tables/groups").listGroups,async function(err,result,field){
                if(err != null){
                    res.json();
                    res.write("{'success': false,'message':'Database Error!'}");
                    res.end();
                    mysql.end();
                    return;
                }
                var data = {};
                var tosend = {
                    success: true,
                }
                await result.forEach(group => {
                    data[group.groupName] = {"uuid: ": group.groupID,"Enabled: ":group.enabled};
                });
                tosend["data"] = data;
                res.json();
                res.write(JSON.stringify(tosend));
                res.end();
                mysql.end();
                return;
            });
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res);
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
                var tosend = {
                    success: true,
                }
                await result.forEach(perm => {
                    data[perm.node] = {" ": perm.name};
                });
                tosend["data"] = data;
                res.json();
                res.write(JSON.stringify(tosend));
                res.end();
                mysql.end();
                return;
            });
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res);
        });
    });
}
module.exports = {
    loadListeners:      loadListeners
}