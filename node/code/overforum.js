var express = require("express");
const http = require('http');
const spdy = require('spdy')
var app = express();
var helmet = require('helmet');
const cookieParser = require("cookie-parser");
const csp = require('express-csp-header');
var path = require("path");
var session = require("express-session");
var bodyParser = require('body-parser');
var mainConfig = require("./config/settings");

var logger = function(req,res,next){
    console.log(req.method+"\t"+req.ip+"\t"+new Date().getTime()+"\t"+req.url);
    next();
}
app.use(helmet());
app.use('*', function(req, res, next) {
    if(!req.secure) {
      var secureUrl = "https://" + req.headers['host'] + req.url; 
      res.writeHead(301, { "Location":  secureUrl });
      res.end();
      next();
    }else{
        res.header('X-XSS-Protection', 1);
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma','no-cache');
        next();
    }
    
});
app.disable('x-powered-by');
app.use(session({ resave: true ,secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) , saveUninitialized: false,cookie:{httpOnly:true,secure:true,sameSite:true}}));
app.use(cookieParser());
app.use(csp({policies: mainConfig.cspPolicies }));
app.use(bodyParser.json({strict:false}));
app.engine('.html', require('ejs').__express);
const httpServer = http.createServer(app);
const httpsServer = spdy.createServer(mainConfig.serverKeys, app);
httpServer.listen(80, () => {
    console.log("HTTP Redirector Listening on 80");
});

httpsServer.listen(443, () => {
    console.log("HTTPS/SPDY Listening on 443");
});


app.use(logger);
var permissions = require("./server_js/auth/permissionManager");
var authmanager = require("./server_js/auth/authManager").startloginListener(app,permissions);
var adminpanel = require("./server_js/admin/panel");
adminpanel.startListeners(app,permissions);
adminpanel.startDependencies(app,permissions);
var locations = require("./server_js/locations").loadAll(app,permissions);