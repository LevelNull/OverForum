var mysql = require("mysql");

function locations(app){
    app.get("/",function(req,res){
        renderFile("index.html",req,res);
    });
}
function renderFile(file,req,res){
    res.render(file);
}
module.exports.locations = locations;