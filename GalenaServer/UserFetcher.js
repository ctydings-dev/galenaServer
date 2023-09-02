
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
            password: password,
            session: session

        };

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                console.log(hash);
                runner.sql.getUserInformation(runner.user, runner.password, runner.caller, runner.session);


            });
        });




    }

}




module.exports = UserFetcher;