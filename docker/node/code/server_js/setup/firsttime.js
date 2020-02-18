var MySql = require('sync-mysql');
var express = require("express");
var _mysql = require("mysql");
var fs = require("fs");
var setupSteps = {
    0: {"url":"setMysql","title":"Set MySql Options..."},
    1: {"url":"createTables","title":"Create MySql Tables..."},
    2: {"url":"acs","title":"Set Admin Password..."},
    3:{"url":"finish","title":"Finish/Cleanup..."}
}
function noSpecial(str){
    var regex = /^[A-Za-z0-9 ]+$/
        return regex.test(str);
}
function containsNumeral(str){
    return /\d/.test(str);
}
function setupListener(app,mysqlopts,goodCallback,badCallback){
    var mysql = _mysql.createConnection(mysqlopts);
    mysql.query(require("../db/tables/users").getUserByEmail,["administrator@localhost"],
    function(err, data, field){
        if(err != null){
            badCallback("Mysql error: "+err);
        }else{
            var entry = data[0];
            if(entry.password == null){
                console.log("Admin password is blank!");
                goodCallback(entry.uuid);
            }else{
                goodCallback(false);
            }
        }
    });
    mysql.end();
}
function startSetupListeners(app,mysqlopts,result){
    app.get("/setup/"+result,function(req,res){
        req.session.uuid = result;
        res.render("setup/adminSetup.html");
        res.end();
    });
    app.get("/setup/setup.js",function(req,res){
        res.sendFile("/var/overforum/conditional/js/setup.js");
    });
    app.post("/setup/"+result+"/createTables", function(req,res){
        res.json();
        var mysql = new MySql(require("../../config/settings").mysqlOptions);
        var sqlresult = mysql.query(require("../db/tables/users").createTable);
        sqlresult = mysql.query(require("../db/tables/groups").createTable);
        sqlresult = mysql.query(require("../db/tables/groups").setDefaults);
        sqlresult = mysql.query(require("../db/tables/permissions").createTable);
        sqlresult = mysql.query(require("../db/tables/permissions").setDefaults);
        sqlresult = mysql.query(require("../db/tables/groupmap").createTable);
        sqlresult = mysql.query(require("../db/tables/groupmap").setDefaults);
        sqlresult = mysql.query(require("../db/tables/permmap").createTable);
        sqlresult = mysql.query(require("../db/tables/permmap").setDefaults);
        res.write("{\"success\":true}");
        res.end();
    });
    app.post("/setup/"+result+"/setMysql", function(req,res){
        res.json();
        if(req.session.mysql.host != ""){
            var towrite = "module.exports = {mysqlOptions:"+JSON.stringify(req.session.mysql)+"}";
            fs.writeFileSync("./config/mysql.js",towrite);
        }
        res.write("{\"success\":true}");
        res.end();
    });
    app.post("/setup/"+result+"/finish", function(req,res){
        res.json();
        res.write("{\"success\":true}");
        res.end();
    });
    app.post("/setup/"+result+"/preSetup", function(req,res){
        app.use(express.json());
        if(req.body){
            req.session.credentials = req.body.credentials;
            req.session.mysql = req.body.options;
            req.body.options = req.body.options;
            testMysql(req,res);
        }else{
            res.write("{\"success\":false,\"message\":\"Invalid input!\"}");
        }
    });
    function testMysql(req,res){
        app.use(express.json());
        res.json();
        if(req.body){
            var options = req.body.options;
            if(options.host === "")options.host = mysqlopts.host;
            if(options.user === "")options.user = mysqlopts.user;
            if(options.password === "")options.password = mysqlopts.password;
            if(options.database === "")options.database = mysqlopts.database;
            if(options.prefix === "")options.refix = mysqlopts.prefix;
            var mysql = new MySql(options);
            try{
                var sqlresult = mysql.query("SHOW TABLES",[]);
                if(sqlresult){
                    res.write("{\"success\":true,\"message\":\"Connected Successfully!\",\"todo\":"+JSON.stringify(setupSteps)+"}");
                    res.end();
                }else{
                    res.write("{\"success\":false,\"message\":\"Failed to connect to MySql Server!\"}");
                    res.end();
                }
            }catch(e){
                res.write("{\"success\":false,\"message\":\"Failed to connect to MySql Server!\"}");
                res.end();
            }
        }
    }
    app.post("/setup/"+result+"/mysqlTest", testMysql);
    app.post("/setup/"+result+"/acs",function(req,res){
        app.use(express.json());
        res.json();
        var bcrypt = require("bcrypt");
        var options = {}
        if(req.session.credentials){
            options = req.session.credentials;
        }else{
            options = req.body.credentials;
        }
        if(options.password === undefined || options.password.length < 8){
            res.write("{\"success\":false,\"message\":\"Password must be at least 8 characters!\"}");
            res.end()
            return;
        }
        if(!noSpecial(options.password) || options.iknowwhatimdoing){
            if(containsNumeral() || options.iknowwhatimdoing){
                var hashpass = bcrypt.hashSync(options.password,14);
                var mysql = new MySql(mysqlopts);
                try{
                    var sqlresult = mysql.query(require("../db/tables/users").setUserPassword,[hashpass,req.session.uuid]);
                    if(sqlresult.affectedRows == 1){
                        res.write("{\"success\":true,\"message\":\"Success!\"}");
                    }else if(sqlresult.affectedRows == 0){
                        res.write("{\"success\":false,\"message\":\"Failed to write to users table!\"}");
                    }else{
                        res.write("{\"success\":false,\"message\":\"Database error\"}");
                    }
                        res.end(); 
                }catch(e){
                    res.write("{\"success\":false,\"message\":\"Database error: "+e+"\"}");
                    res.end(); 
                }            
            }else{
                res.write("{\"success\":false,\"message\":\"Password contains no numbers!\"}");
                res.end();   
            }
        }else{
            res.write("{\"success\":true,\"message\":\"Password contains no special characters!\"}");
            res.end();
        }
        
    });
    // app.post("/setup/"+result+"/setupParams",function(req,res){
    //     app.use(require("express").json());
    //     res.json();
    //     var params = {
    //         "Set admin password": "acs",
    //         "Create MySql Tables": "createTables"
    //     }
    //     res.write("{\"success\":true,\"message\":\"Connected\",\"params\":"+JSON.stringify(params)+"}");
    //     res.end();
    // });
}
module.exports.setupListener = setupListener;
module.exports.startSetupListeners = startSetupListeners;