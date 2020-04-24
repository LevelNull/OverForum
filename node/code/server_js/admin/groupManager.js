var _mysql = require("mysql");
var express = require("express");
var renderer = require("./../tools/renderer");
var config = require("./../../config/mysql");
var path = require("path");
var fs = require("fs");
var sanitize = require("../tools/sanitizer");

module.exports= {
    startListeners: startListeners
}

function startListeners(app,permissions){
    app.post("/admin/panel/groups",async function(req,res){
        permissions.isAllowed(req,"server.groups.list")
        .then(yes =>{
            listGroups(app,req,res);
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
}



function listGroups(app,req,res){
    var mysql = _mysql.createConnection(config.mysqlOptions);
    mysql.query(require("./../db/tables/groups").listGroups,async function(err,result,field){
        if(err != null){
            res.json({success: false,message:'Database Error!'});
            mysql.end();
            return;
        }
        var data = {};
        var headers = {
            0: "Name",
            1: "Status"
        }
        await result.forEach(group => {
            data[group.groupID] = {"Name": group.groupName};

            switch(group.enabled){
                case 1:     data[group.groupID]["Status"] = "Enabled"; break;
                default:    data[group.groupID]["Status"] = "Disabled";
            }
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
}