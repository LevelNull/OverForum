var express = require("express");
var _mysql = require("mysql");

async function renderFile(file,req,res,permissions=undefined,code=200){
    if(req.session.user){
        res.locals.user = req.session.user;
        //console.log(req.session.user);
        if(permissions != undefined){
            await permissions.isAllowed(req,"pages.adminpanel.view").then(yes => {}).catch(no => {});
            getFile(file,req,res,code);
        }else{
            getFile(file,req,res,code);
        }
    }else{
        getFile(file,req,res,code);
    }
}
function getFile(file,req,res,code=200){
    res.status(code);
    res.header("Content-Type","text/html");
    res.render(file);
    res.end();
}

module.exports = {
    renderFile: renderFile
}