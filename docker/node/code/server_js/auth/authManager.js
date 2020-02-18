var bcrypt = require("bcrypt");
var _mysql = require("mysql");
var express = require("express");
var permissions = require("./permissionManager");

function login(cred){
    
    return false;
}
function startloginListener(app,perms){
    permissions = perms;
    app.post("/acs",function(req,res){
        var mysql = _mysql.createConnection(require("../../config/settings").mysqlOptions);
        app.use(express.json());
        mysql.query(require("../db/tables/users").getUserByEmail,[req.body.username],
         function(err,data,field){
            if(err != null){
                res.type("application/json");
                res.write("{\"success\":false,\"message\":\"Database Error\"}");
                res.status(200);
                res.end();
                console.log(err);
                return err;
            }
            if(data.length > 0){
            if(data[0].password == null){
                if(data[0].username == "administrator" && data[0].email == "administrator@localhost"){
                    res.type("application/json");
                    res.write("{\"success\":true,\"goto\": \"/setup/"+data[0].uuid+"\"}");
                    res.status(200);
                    res.end();
                }
            }else{
                var result = bcrypt.compareSync(req.body.password,data[0].password);
                res.type("application/json");
                if(result){
                    var userinfo = {
                        uuid:       data[0].uuid,
                        uuidBin:    data[0].uuidBin,
                        username:   data[0].username,
                        email:      data[0].email,
                        firstname:  data[0].firstname,
                        lastname:   data[0].lastname,
                        emailver:   data[0].emailverified,
                        enabled:    data[0].enabled
                    }
                    req.session.user = userinfo;
                    permissions.applySessionPermissions(req);
                    
                    
                    req.session.save();
                    res.write("{\"success\":true,\"goto\": \""+req.body.returnto+"\"}");
                    res.end();
                }else{
                    res.write("{\"success\":false,\"message\":\"Incorrect login details\"}");
                    res.end();
                }
                
            }
        }else{
            res.type("application/json");
                res.write("{\"success\":false,\"message\":\"Incorrect login details\"}");
                res.status(200);
                res.end();
                return err;
        }
        });
        mysql.end();
      });
}

module.exports = {
    startloginListener: startloginListener,
    permissions: permissions
}