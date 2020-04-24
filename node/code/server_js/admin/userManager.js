var _mysql = require("mysql");
var express = require("express");
var renderer = require("./../tools/renderer");
var config = require("./../../config/mysql");
var path = require("path");
var fs = require("fs");
var sanitizer = require("../tools/sanitizer");

module.exports= {
    startListeners: startListeners
}

function startListeners(app,permissions){
    app.get("/admin/panel/addUser.js",async function(req,res){
        permissions.isAllowed(req,"server.users.add")
        .then(yes =>{
            if(fs.existsSync(path.join(path.join(__dirname,"../../"),"conditional/js/addUser.js"))){
                
                res.sendFile(path.join("conditional/js/addUser.js"),{root: path.join(__dirname,"../../")});
            }else{
                renderer.renderFile("status/none.html",req,res,permissions,404);
            }
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.get("/admin/panel/userDetails.js",async function(req,res){
        permissions.isAllowed(req,"server.users.details.others")
        .then(yes =>{
            if(fs.existsSync(path.join(path.join(__dirname,"../../"),"conditional/js/userDetails.js"))){
                
                res.sendFile(path.join("conditional/js/userDetails.js"),{root: path.join(__dirname,"../../")});
            }else{
                renderer.renderFile("status/none.html",req,res,permissions,404);
            }
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.get("/admin/panel/addUser",async function(req,res){
        permissions.isAllowed(req,"server.users.add")
        .then(yes =>{
            res.locals.groups = permissions.getGroups();
            renderer.renderFile("admin/addUserPrompt.html",req,res,permissions);
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.post("/admin/panel/addUser",async function(req,res){
        permissions.isAllowed(req,"server.users.add")
        .then(yes =>{
            addUser(app,req,res,permissions);
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.post("/admin/panel/users",async function(req,res){
        permissions.isAllowed(req,"server.users.list")
        .then(yes =>{
            listUsers(app,req,res,permissions)
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.post("/admin/panel/userDetails",async function(req,res){
        permissions.isAllowed(req,"server.users.details.others")
        .then(yes =>{
            getUserDetails(app,req,res,permissions,true);
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
    app.get("/admin/panel/userDetails",async function(req,res){
        permissions.isAllowed(req,"server.users.details.others")
        .then(yes =>{
            getUserDetails(app,req,res,permissions,false);
        })
        .catch(no => {
            renderer.renderFile("status/none.html",req,res,permissions,404);
        });
    });
}

function getUserDetails(app,req,res,permissions,json=true){
    app.use(express.json());
    //console.log(req);
    if(req.body.requestedUser){
        var user = req.body.requestedUser;
        var mysql = _mysql.createConnection(config.mysqlOptions);
        mysql.query(require("../db/tables/users").getUserByUUID,[user],async function(err,result,field){
            if(err != null){
                res.json({success: false,message:'Database Error!'});
                mysql.end();
                return;
            }else{
                var data = {
                    uuid:       result.userid,
                    username:   result.username,
                    firstname:  result.firstname,
                    lastname:   result.lastname,
                    joined:     result.joinedOn,
                    lastSeen:   result.lastSeen,
                    usermode:   result.userMode,
                    email:      result.email,
                    emailverif: result.emailVerified
                };
                //console.log(data);
                if(json){
                    res.json({success:true, data: data});
                }else{
                    res.locals.user = data;
                    renderer.renderFile("admin/userDetails.html",req,res,permissions);
                }
            }
        });
        mysql.end();
    }
    
}

async function listUsers(app,req,res,permissions){
    var mysql = _mysql.createConnection(config.mysqlOptions);
    mysql.query(require("../db/tables/users").getUserListLimited,[0],async function(err,result,field){
        if(err != null){
            res.json({success: false,message:'Database Error!'});
            mysql.end();
            return;
        }
        var headers = {
            0: "First Name",
            1: "Last Name",
            2: "Username",
            3: "Email",
            4: "User Mode"
        }
        var data = {};
        await result.forEach(user => {
            data[user.userid] = {
                "Username": user.username,
                "First Name": user.firstname,
                "Last Name": user.lastname,
                "Email":    user.email
            };
            switch(user.userMode){
                case 0: data[user.userid]["User Mode"] = "Enabled"; break;
                case 1: data[user.userid]["User Mode"] = "Disabled"; break;
                case 2: data[user.userid]["User Mode"] = "Restricted"; break;
                default: data[user.userid]["User Mode"] = "Unknown";
            }
        });
        var menu = "<a class=cMenuHeader >User Quick Actions</a><div class=cMenuContents><a>Details</a><a class=errorText>Delete</a></div>";
        var tosend = {
            success: true,
            headers: headers,
            menu:  menu,
            data
        }
        //console.log(tosend);
        res.json(tosend);
        mysql.end();
        return;
    });
}

async function addUser(app,req,res,permissions){
    var options = req.body;
    app.use(express.json());
        var bcrypt = require("bcrypt");
        if(!sanitizer.isEmailAddress(options.email) && !options.iknowwhatimdoing){
            res.json({success: false, message: "Email address is invalid!"});
            return;
        }
        if(options.password){
            if(options.password.length < 8){
                res.json({success: false,message: "Password must be at least 8 characters!"});
                return;
            }
            if(!sanitizer.noSpecial(options.password) || options.iknowwhatimdoing){
                if(sanitizer.containsNumeral() || options.iknowwhatimdoing){
                    var hashpass = bcrypt.hashSync(options.password,14);
                    var mysql = _mysql.createConnection(config.mysqlOptions);
                    try{
                        var newuser = [
                            options.username.toLowerCase(),
                            options.email.toLowerCase(),
                            hashpass,
                            options.firstname.toLowerCase(),
                            options.lastname.toLowerCase(),
                            Math.round(Date.now() / 1000),
                            0,
                            options.usermode
                        ];
                        mysql.query(require("../db/tables/users").addUser,newuser, async function(err, sqlresult, field){
                            if(err != null){
                                console.log(err);
                                if(err.code == "ER_DUP_ENTRY"){
                                    res.json({success: false, message: err.message});
                                    //Until further error reporting gets done
                                }else{
                                    res.json({success: false, message: "Database Error!"});
                                }
                                return;
                            }else{
                                if(options.group != 'false'){
                                    var mysql = _mysql.createConnection(config.mysqlOptions);
                                    mysql.query(require("../db/tables/groupmap").addEntry,[options.email,options.group],
                                    function(err,result,field){
                                        if(err != null){
                                            console.log(err);
                                            res.json({success: false, message: "Database Error!"});
                                        }else{
                                            res.json({success: true, message: "Success!"});
                                        }
                                    });
                                }else{
                                    res.json({success: true, message: "Success!"});
                                }
                            
                            }
                        });
                        
                    }catch(e){
                        res.json({success: false, message: "Database Error!"});
                    } 
                    mysql = null;
                }else{
                    res.json({success: false, message: "Password contains no numbers!"}); 
                }
            }else{
                res.json({success: false, message: "Password contains no special characters!"});
            }
        }else{
            res.json({success: false,message: "No password "});
        }
    
}