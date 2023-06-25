class GalenaModule {

    constructor() {
        var output = require('./Outputter.js');
        this.outputter = new output();




    }
    getOutputter = function () {
        return this.outputter;
    }

    test = function () {
        return 'DONDE ESTA';
    }

}

module.exports = GalenaModule;