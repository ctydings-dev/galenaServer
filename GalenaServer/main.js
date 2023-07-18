const http = require('http');
const port = 9900;
const cors = require('cors');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});




var mod = require('./sql/MySQLConnector.js');
var sysController = require('./EncryptionModule.js');
test = new mod('localhost', 'root', 'Per@grin1', 'test_db');
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
            res.send(controller.processRequest(req));
            return;
        }
    } catch (e) {
    }
    return res.status(400).send({
        message: 'This is an error!'
    });
});


app.post('/tunnel_request', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');



    var session = req.body.session;
    var aes = req.body.aesKey;
    var decryptedAES = controller.RSADecrypt(aes);
    console.log("ORIG " + aes);
    console.log('AES ' + decryptedAES);

    controller.addAESKey(session, decryptedAES);

    res.send('Session Establied');

});


app.post('/command', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');



    var session = req.body.session;
    var cmd = req.body.command;





    res.send('Session Establied');

});












app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
var testText = 'HELLO DOLLY';
//var en = controller.RSAEncrypt(testText);
//console.log(en.length);
//console.log(controller.RSAEncrypt("HELLO DOLLY"));
//console.log(controller.RSAEncrypt('HELLO DOLLY').toString());
//console.log(controller.RSADecrypt(controller.RSAEncrypt('HELLO DOLLY')).toString());


function dumpMessage(testName, mesg) {
    console.log(getTime() + testName + ":: --> " + mesg);
}
;

function getTime() {
    var ts = new Date();
    return ts.toLocaleTimeString() + ":" + ts.getMilliseconds() + "  ";
}
;