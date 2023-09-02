
const crypto = require('crypto');

const UserFetcherClass = require('./UserFetcher.js');

var RSA = require('hybrid-crypto-js').RSA;

var Crypt = require('hybrid-crypto-js').Crypt;


class EncryptionModule {

    constructor(address, dbName, user, password) {
        this.generateRSAKeys();

        this.aesKeyBank = {};
        this.rsaKeyBank = {};
        this.userFetcher = new UserFetcherClass(address, dbName, user, password)


    }

    getUserFetcher = function () {
        return this.userFetcher;
    }

    getRSAKeyBank = function () {
        return this.rsaKeyBank;
    }

    storeClientRSAKey = function (session, name, password, key)
    {
        var user = {};

        console.log(this.getUserFetcher().getUser);

        this.getRSAKeyBank()[session] = {

            key: key


        };



        this.getUserFetcher().getUser(name, password, this, session);


        //  this.getRSAKeyBank()[session] = key;
    }

    getClientRSAKey = function (session) {

        if (this.getRSAKeyBank()[session] === null) {
            throw session + ' has not been registered!';
        }
        return this.getRSAKeyBank()[session].key;

    }

    getUser = function (session) {

        if (this.getRSAKeyBank()[session] === null) {
            throw session + ' has not been registered!';
        }
        return this.getRSAKeyBank()[session].user;


    }

    generateRSAKeys = function () {


        var rsa = new RSA();
        var caller = this;

        rsa.generateKeyPair(function (keyPair) {
            // Callback function receives new 1024 bit key pair as a first argument
            //  console.log('SERVER RSA Public Key: ' + keyPair.publicKey);

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

    RSASessionEncrypt = function (data, session) {

        var key = this.getClientRSAKey(session);
        return this.RSAEncrypt(data, key);


    }

    RSAEncrypt = function (data, key) {

        var crypt = new Crypt({

            rsaStandard: 'RSA-OAEP'
        });

        var encrypted = crypt.encrypt(key, data);

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