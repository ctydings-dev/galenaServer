
var sqlConnection = require('./sql/MySQLConnector.js');

const bcrypt = require('bcrypt');



const myPlaintextPassword = 'Per@grin1';






class UserFetcher {

    constructor(address, dbName, user, password) {


        this.sql = new sqlConnection(address, user, password, dbName);

    }

    getSQLConnection = function () {
        return this.sql;
    }

    getSaltRoundCount = function () {
        return 10;
    }

    getUser = function (user, password, caller, session) {

        var saltRounds = this.getSaltRoundCount();

        var runner = {

            caller: caller,
            sql: this.getSQLConnection(),
            user: user,

            session: session

        };

        this.getSQLConnection().getUserInformation(user, password, caller, session);






    }

}




module.exports = UserFetcher;