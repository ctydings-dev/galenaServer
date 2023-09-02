



var encryption = require('./EncryptionModule.js');
var genUtilClass = require('./GenUtils.js');
var resGen = require('./ResponseGenerator.js');
class SystemController {

    constructor(address, user, password, dbName) {

        this.encryptionMod = new encryption(address, dbName, user, password);
        this.modules = [];
        this.counters = {};
        this.genUtils = new genUtilClass();
        this.currentModule = '';
    }

    getServerCmdDelimiter = function () {
        return '!';
    }

    getEncyptionModule = function () {
        return this.encryptionMod;
    }

    getModules = function () {
        return this.modules;
    }

    getGenUtils = function () {
        return this.genUtils;
    }

    addModule = function (toAdd) {


        this.getModules()[toAdd.getName()] = toAdd;
        console.log(this.getModules().length);
        if (this.getModule() === null || this.getModule() === undefined) {
            this.setModule(toAdd.getName());
        }

    }

    hasModule = function (name) {

        return this.genUtils.isNull(this.getModules()[name]) === false;
    }

    setModule = function (name) {
        if (this.hasModule(name) === false) {
            throw name + ' is not a valid module;'
        }

        this.currentModule = name;
    }

    getCurrentModuleName = function () {
        return this.currentModule;
    }

    getModule = function () {

        return this.getModules()[this.getCurrentModuleName()];
    }

    sendResponse = function (value, session, res) {

        var response = this.encryptPayload(session, value);
        res.send(response);
    }

    checkReplayAttack = function (payload) {
        if (this.counters[payload.session] === undefined) {
            this.counters[payload.session] = payload.counter;
            return;

        }

        var comp = this.counters[payload.session];


        if (payload.counter <= comp) {
            return false;
        }

        this.counters[payload.session] = payload.counter;

        return true;
    }

    executeCommand = function (payload, req, res) {


        if (this.checkReplayAttack(payload) === false) {

            console.log('Replay detected!');



            return;
        }


        try {
            this.getModule().executeCommand(payload, req, res, this);
        } catch (throwable) {

        }


    }

    encryptPayload = function (session, payload) {

        payload = JSON.stringify(payload);
        payload = this.getEncyptionModule().RSASessionEncrypt(payload, session);
        var ret = {
            payload: payload
        };
        return ret;
    }

    executeSystemCommand = function (session, cmd) {


        if (cmd.trim().indexOf('#') === 0) {

            cmd = cmd.trim();
            cmd = cmd.substring(1, cmd.length);
            cmd = '!' + cmd;
        }

        var broken = this.breakupCommand(cmd);
        var cmds = broken.broken;
        if (cmds[0] === '!ECHO') {



            var msg = '';
            for (var index = 1; index < broken.orig.length; index++) {
                msg = msg + broken.orig[index] + ' ';
            }
            msg = msg.trim();
            console.log('Echo Response: ' + msg);
            return resGen.createStringResponse(msg);
        }




        return;
    }

    hasModule = function (toCheck) {

        return this.getGenUtils().isNull(this.getModules()[toCheck]) !== null;
    }

    encryptResponse = function () {
        return true;
    }

    setCurrentModule = function (toSet) {

        if (this.hasModule(toSet) === false) {
            throw toSet + ' is not a valid module!';
        }
        this.currentModule = toSet;
    }

    getCurrentModule = function () {
        return this.getModules()[this.currentModule];
    }

    encryptResponse = function (session, message) {
        var key = this.getEncyptionModule().getClientRSAKey(session);
        var ret = this.getEncyptionModule().RSAEncrypt(message, key);
        ret = JSON.stringify(ret);
        return ret;
    }

    isSystemCommand = function (cmd) {

        if (cmd.indexOf(this.getServerCmdDelimiter()) === 0) {
            return true;
        }


        return false;
    }

    breakupCommand = function (cmd) {

        var orig = this.getGenUtils().breakupString(cmd, ' ');
        var broken = [];
        for (var prop in orig) {
            var parsed = orig[prop].toUpperCase();
            broken.push(parsed);
        }

        var ret = {
            broken: broken,
            orig: orig
        };
        return ret;
    }

}

module.exports = SystemController;