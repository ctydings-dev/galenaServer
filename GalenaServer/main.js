const http = require('http');
const port = 9900;
const cors = require('cors');
var bodyParser = require('body-parser');
var cmdResponse = require('./CommandResponse.js');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mod = require('./sql/MySQLConnector.js');
//var sysController = require('./EncryptionModule.js');
var sysController = require('./SystemController.js');
test = new mod('localhost', 'root', 'Per@grin1', 'caliber');
var stmt = 'SHOW TABLES;';
test.executeStatement(stmt, true);
//console.log(test.getOutputter().toString());

var controller = new sysController();
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
            res.send(controller.getEncyptionModule().processRequest(req));
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
    //  console.log(test.getOutputter().toString());




    var client = req.body;
    var decrypt = controller.getEncyptionModule().RSADecrypt(client.payload);
    var payload = JSON.parse(decrypt);
    var session = payload.session;
    var key = payload.rsaKey;
    var password = payload.password;
    controller.getEncyptionModule().storeClientRSAKey(session, password, key);
    console.log('RSA tunnel establisehd for session: ' + session);
    res.send('Session Establied');
});
app.post('/rsa_echo', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('RSA echo request recieved');
    try {
        var client = req.body;
        var decrypt = controller.getEncyptionModule().RSADecrypt(client.payload);
        var payload = JSON.parse(decrypt);
        var session = payload.session;
        var msg = payload.message;
        console.log('Echo Message: ' + msg);
        var key = controller.getEncyptionModule().getClientRSAKey(session);
        var echo = controller.getEncyptionModule().RSAEncrypt(msg, key);
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
        var decrypt = controller.getEncyptionModule().RSADecrypt(client.payload);
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
        var decrypt = controller.getEncyptionModule().RSADecrypt(client.payload);
        var payload = JSON.parse(decrypt);
        console.log(payload.type);
        if (payload.type === 'COMMAND') {
            //   var session = payload.session;
            //  var cmd = payload.command;
            //  var ret = controller.executeCommand(session, cmd);
            payload.commandName = payload.args[0].trim().toUpperCase();
            if (payload.commandName === 'SQL_DUMP')
            {

                var tableName = payload.args[1];

                var callbackCaller = {

                };

                callbackCaller.parent = this;
                callbackCaller.controller = controller;
                callbackCaller.session = payload.session;
                callbackCaller.res = res;

                callbackCaller.process = function (value) {


                    var cmds = value.getCreateStatements();
                    var ret = new cmdResponse('SQL', cmds);

                    ret.setPrelim(value.rowData.getCreate());


                    var response = ret.createResponses();
                    console.log(response);
                    response = this.controller.encryptPayload(this.session, response);

                    //  res.send(response);

                    this.res.send(response);

                    console.log('DONE');

                };


                callbackCaller.sql = test;
                callbackCaller.tableName = tableName;



                test.getTableStructure(tableName, false, callbackCaller, 'process');
                ret = test.getOutputter().toString();
//        console.log(test.getOutputter().toString());


                //    res.send(ret);
                return;


            }

        }

        return res.status(400).send({
            message: payload.type + ' is not a valid request!'
        });

    } catch (err) {
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