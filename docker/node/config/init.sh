#!/bin/bash
sslValid=true
SSLDIR=/var/overforum/cert
CERT=/var/overforum/cert/cert.pem
KEY=/var/overforum/cert/privkey.pem
CA=/var/overforum/cert/chain.pem
if test -e "$SSLDIR";then
    echo "Certificate Directory present..."
else
    mkdir /var/overforum/cert
    sslValid=false
fi
if test -f "$CERT"; then
    echo "Server Certificate Presesnt..."
else
    sslValid=false
fi
if test -f "$KEY"; then
    echo "Server Key Present..."
else
    sslValid=false
fi
if test -f "$CA"; then
    echo "Server CA Present..."
else
    sslValid=false
fi

if $sslValid ; then
    echo "Server configured using provided cert and key."
else
    echo "Generating Self signed certificate..."
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj "/C=US/''=Denial/L=''/O=Dis/CN=overforum" \
    -keyout $KEY  -out $CERT
    cp $CERT $CA
fi
cd /var/overforum
if test -f "jquery*" ; then
    echo "Using provided JQuery file..."
else
    cd web_js
    wget https://code.jquery.com/jquery-3.4.1.min.js -O jquery.js
    cd ..
fi
npm i
while ! nc -z overforum_mysql 3306; do sleep 3; echo "Waiting for MySql Container..."; done
echo "MySql container online, starting up..."
node overforum.js