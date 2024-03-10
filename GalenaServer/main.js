const http = require('http');
const port = 9900;
const cors = require('cors');
var bodyParser = require('body-parser');
var cmdResponse = require('./CommandResponse.js');
var resGen = require('./ResponseGenerator.js');
var sqlModuleClass = require('./sql/SQLModule.js');






var message = 'test';








var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mod = require('./sql/MySQLConnector.js');
//var sysController = require('./EncryptionModule.js');
var sysController = require('./SystemController.js');
test = new mod('localhost', 'root', 'Per@grin1', 'caliber');
var stmt = 'SHOW TABLES;';
//console.log(test.getOutputter().toString());

var controller = new sysController('localhost', 'root', 'Per@grin1', 'galena');
controller.addModule(new sqlModuleClass('localhost'));
const {generateKeyPair} = require('crypto');
const crypto = require('crypto');
var out = 'NA';
var pubKey = '';
// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {
// The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
});
const data = "my secret data bois!";
const express = require('express');
const app = express();
const PORT = 9900;
app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    var out = req.query;
    try {
        if (req.query.public_key_request === 'true') {
            res.send(controller.getEncryptionModule().processRequest(req));
            return;
        }
    } catch (e) {
    }
    return res.status(400).send({
        message: 'This is an error!'
    });
});
app.post('/rsa_tunnel_request', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');

    var client = req.body;
    var decrypt = controller.getEncryptionModule().RSADecrypt(client.payload);
    var payload = JSON.parse(decrypt);
    var session = payload.session;
    var key = payload.rsaKey;
    var password = payload.password;
    var user = payload.user;

    controller.getEncryptionModule().storeClientRSAKey(session, user, password, key);
    console.log('RSA tunnel establisehd for session: ' + session);
    res.send('Session Establied');
});
app.post('/rsa_echo', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('RSA echo request recieved');
    try {
        var client = req.body;
        var decrypt = controller.getEncryptionModule().RSADecrypt(client.payload);
        var payload = JSON.parse(decrypt);
        var session = payload.session;
        var msg = payload.message;
        console.log('Echo Message: ' + msg);
        var key = controller.getEncryptionModule().getClientRSAKey(session);
        var echo = controller.getEncryptionModule().RSAEncrypt(msg, key);
        echo = JSON.stringify(echo);
        res.send(echo);
    } catch (err) {
        console.log(err);
        res.send(err);
    }



});

app.controller = controller;
app.getController = function () {
    return this.controller;
};











app.get('/db_dump', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('DB DUMP REQUEST');
    try {



        var client = req.body;
        var decrypt = controller.getEncryptionModule().RSADecrypt(client.payload);
        var payload = JSON.parse(decrypt);
        var session = payload.session;
    } catch (err) {
        console.log(err);
        res.send(err);
    }



});
app.post('/rsa_request', urlencodedParser, function (req, res) {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        var client = req.body;
        var decrypt = controller.getEncryptionModule().RSADecrypt(client.payload);
        var payload = JSON.parse(decrypt);

        var user = controller.getUser(payload.session);

        console.log('RSA request from user: ' + user.getUser());
        var permit = user.permitRSACommand();
        console.log('PERMITD : ' + permit);
        if (user.permitRSACommand() !== true) {


            var response = resGen.createErrorResponse('Account does not have RSA Command Privilages!');

            controller.sendResponse(response, payload.session, res);
            console.log('RSA request denied!');
            return;


        }

        if (payload.type === 'BACKLOG') {

            var counter = payload.counter;
            var index = payload.index;

        }


        if (payload.type === 'COMMAND') {

            controller.executeCommand(payload, req, res, user);

            return;


        }

        return res.status(400).send({
            message: payload.type + ' is not a valid request!'
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            message: 'Server Error: ' + err
        });

    }


});
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});












function dumpMessage(testName, mesg) {
    console.log(getTime() + testName + ":: --> " + mesg);
}
;
function getTime() {
    var ts = new Date();
    return ts.toLocaleTimeString() + ":" + ts.getMilliseconds() + "  ";
}
;