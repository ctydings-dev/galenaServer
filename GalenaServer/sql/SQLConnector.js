
var gm = require('../GalenaModule.js');

class SQLConnector extends gm {

    constructor(db) {
        super();
        this.db = db;





    }

    getDB = function () {
        return this.db;
    }

    test = function () {
        return 'HELLO DOLLY2';
    }

}

module.exports = SQLConnector;