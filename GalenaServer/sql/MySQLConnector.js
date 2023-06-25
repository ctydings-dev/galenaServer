
var base = require('./SQLConnector.js');

class MySQLConnector extends base {

    constructor(host, user, pswd, db) {
        super(db);
        this.user = user;
        this.host = host;
        this.password = pswd;
        this.establishConnection();

    }

    getUser = function () {

        return this.user;


    }

    getPassword = function () {
        return this.password;
    }

    getHost = function () {

        return this.host;

    }

    getConnection = function () {
        return this.connection();

    }

    establishConnection = function () {


        var mysql = require('mysql');

        var host = this.getHost();
        var user = this.getUser();
        var paswd = this.getPassword();

        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: paswd
        });

        var out = this.getOutputter();
        this.connection.connect(function (err) {
            if (err)
                throw err;
            out.log("Connected!");
        });


    }

}

module.exports = MySQLConnector;