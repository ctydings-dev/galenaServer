
const crypto = require('crypto');

var RSA = require('hybrid-crypto-js').RSA;

var Crypt = require('hybrid-crypto-js').Crypt;


class EncryptionModule {

    constructor() {
        this.generateRSAKeys();

        this.aesKeyBank = {};

    }

    addAESKey = function (client, key) {

        console.log('Adding new session: ' + client);

        var toAdd = {

            client: client,
            key: key


        };
        this.getAESKeyBank()[client] = toAdd;

    }

    getAESKeyBank = function () {
        return this.aesKeyBank;
    }

    decryptAES = function (message, key) {



    }

    AESEncrypt = function (message, key) {

        var crypt = new Crypt({
            aesStandard: 'AES-CBC'
        });

        return crypt.encrypt(key, message);


    }

    generateRSAKeys = function () {


        var rsa = new RSA();
        var caller = this;

        rsa.generateKeyPair(function (keyPair) {
            // Callback function receives new 1024 bit key pair as a first argument
            console.log('SERVER RSA Public Key: ' + keyPair.publicKey);

            caller.publicKey = keyPair.publicKey;
            caller.privateKey = keyPair.privateKey;


        }, 1024); // Key size


    }

    getPublicKey = function () {
        return this.publicKey;
    }

    getPrivateKey = function () {

        return this.privateKey;
    }

    exportRSAKey = function () {

        return this.getPublicKey();
        return this.getPublicKey().export({
            type: "pkcs1",
            format: "pem",
        });
    }

    processRequest = function (request) {

        return this.RSAKeyRequest();

    }

    RSAKeyRequest = function () {
        console.log('RSA public key request recieved.');
        return this.exportRSAKey();





    }

    RSAEncrypt = function (data) {

        var crypt = new Crypt({

            rsaStandard: 'RSA-OAEP'
        });

        var encrypted = crypt.encrypt(this.getPublicKey(), data);

        return encrypted;
        //   return JSON.parse(encrypted).cipher;



    }

    RSADecrypt = function (data) {
        var priKey = this.getPrivateKey();


        var crypt = new Crypt({

            rsaStandard: 'RSA-OAEP'
        });

        var decrypted = crypt.decrypt(priKey, data);
        return decrypted.message;
    }

}

module.exports = EncryptionModule;