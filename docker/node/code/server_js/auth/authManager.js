var bcrypt = require("bcrypt");
var _mysql = require("mysql");
var mysql = _mysql.createPool(require("../../config/settings").mysqlOptions);
var express = require("express");
var permissions = require("./permissionManager");

function checkLogin(app,req,res,perms){
    permissions = perms;
    app.use(express.json());
    mysql.query(require("../db/tables/users").getUserByEmail,[req.body.username],
     function(err,data,field){
        if(err != null){
            errorHandler(err).then(retry=> {checkLogin(app,req,res,perms);}).catch(fail => {
            res.json({success:false,message:"Database Error!"});
            });
        }else{
            if(data.length > 0){
                if(data[0].password == null){
                    if(data[0].username == "administrator" && data[0].email == "administrator@localhost"){
                        res.json({success:true,goto: "/setup/"+data[0].uuid});
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
                        if(req.body.returnto.includes("<")){
                            res.json({success:true,goto: "/"});
                        }else{
                            res.json({success:true,goto: req.body.returnto});
                        }
                        
                    }else{
                        res.json({success:false,message:"Incorrect login details"});
                    }
                    
                }
            }else{
                res.type("application/json");
                    res.json({success:false,message:"Incorrect login details"});
                    return err;
            }
        }
    });
}
function startloginListener(app,perms){
    app.post("/acs",function(req,res){
        checkLogin(app,req,res,perms);
    });
    app.post("/logout",function(req,res){
        if(req.session.user){
            req.session.destroy();
        }
    });
}
function errorHandler(err){
    return new Promise((resolve,reject)=>{
        if(err.code == "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("Restart mysql connection...");
            mysql = _mysql.createConnection(require("../../config/settings").mysqlOptions);
            resolve();
        }else if(err.code == "ER_NO_SUCH_TABLE"){
            console.error(err.sqlMessage);
            reject();
        }else{
            console.error(err);
            throw new Error("There has been an Error in AuthManager!");
            reject();
        }
    });
    
}
module.exports = {
    startloginListener: startloginListener,
    permissions: permissions
}