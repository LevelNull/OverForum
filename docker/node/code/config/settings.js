const fs = require('fs');
const csp = require('express-csp-header');
module.exports = {
    serverKeys: {
        key: fs.readFileSync('/var/overforum/cert/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/var/overforum/cert/cert.pem', 'utf8'),
        ca: fs.readFileSync('/var/overforum/cert/chain.pem', 'utf8')
    },
    mysqlOptions: require("./mysql").mysqlOptions,
    cspPolicies: {
        'default-src': [csp.SELF],
        'font-src': ['*'],
        'script-src': [csp.SELF],
        'style-src': [csp.SELF, 'http://fonts.googleapis.com/'],
        'img-src': ["*"],
        'worker-src': [csp.NONE],
        'block-all-mixed-content': true
    }
}