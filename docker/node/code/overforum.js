var express = require("express");
const http = require('http');
const fs = require('fs');
const spdy = require('spdy')
var app = express();
var helmet = require('helmet');
const cookieParser = require("cookie-parser");
const csp = require('express-csp-header');
var path = require("path");
var session = require("express-session")
var bodyParser = require('body-parser');

const privateKey = fs.readFileSync('/var/overforum/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/var/overforum/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('/var/overforum/cert/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
app.use(helmet());
app.disable('x-powered-by');
app.use(session({ resave: true ,secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) , saveUninitialized: true}));
app.use(cookieParser());
app.use(csp({
    policies: {
        'default-src': [csp.SELF],
        'font-src': ['*'],
        'script-src': [csp.SELF],
        'style-src': [csp.SELF, 'http://fonts.googleapis.com/'],
        'img-src': ["*"],
        'worker-src': [csp.NONE],
        'block-all-mixed-content': true
    }
  }));
app.engine('.html', require('ejs').__express);
const httpServer = http.createServer(app);
const httpsServer = spdy.createServer(credentials, app);
httpServer.listen(80, () => {
    console.log("HTTP Listening on 80");
});

httpsServer.listen(443, () => {
    console.log("HTTPS/SPDY Listening on 443");
});
var locations = require("./server_js/locations").locations(app);