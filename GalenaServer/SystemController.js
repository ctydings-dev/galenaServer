



var encryption = require('./EncryptionModule.js');
var genUtilClass = require('./GenUtils.js');
var resGen = require('./ResponseGenerator.js');

class SystemController {

    constructor() {

        this.encryptionMod = new encryption();
        this.modules = {};
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
    }

    executeCommand = function (session, cmd) {



        console.log(session + ' : ' + cmd);


        cmd = cmd.trim();
        if (this.isSystemCommand(cmd) === true) {
            var ret = this.executeSystemCommand(session, cmd);

            if (this.encryptResponse() === true) {
                ret = this.encryptPayload(session, ret);
            }
            return ret;


        }

        return this.getCurrentModule().execute(cmd);

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

        return this.getGenUTils.isNull(this.getMOdules()[toCheck]) !== null;

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

    isSystemCommand = function (cmd) {

        if (cmd.indexOf(this.getServerCmdDelimiter()) === 0) {
            return true;
        }


        return false;
    }

    breakupCommand = function (cmd) {

        var orig = this.getGenUtils().breakupString(cmd, ' ');
        var broken = [];
        console.log(orig);
        for (var prop in orig) {
            var parsed = orig[prop].toUpperCase();
            broken.push(parsed);
            //console.log(broken + ' : ' + parsed);

        }

        var ret = {
            broken: broken,
            orig: orig
        };
        return ret;


    }

}

module.exports = SystemController;