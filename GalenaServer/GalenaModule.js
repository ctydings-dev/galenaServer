class GalenaModule {

    constructor(name) {
        this.name = name;
        var output = require('./Outputter.js');
        this.outputter = new output();




    }

    getName = function () {
        return this.name;
    }

    getOutputter = function () {
        return this.outputter;
    }

    executeCmd = function (payload, req, res, caller) {

    }

}

module.exports = GalenaModule;