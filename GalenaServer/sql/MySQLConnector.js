
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
        return this.connection;

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
            out.log("Connected to MySQL Server!");
        });
        var db = this.getDB();
        var sql = 'USE  ' + db;

        this.executeStatement(sql);
        out.log('Using database ' + db);



    }

    executeStatement = function (stmt, echo) {

        if (echo !== true) {
            echo = false;
        }
        var out = this.getOutputter();
        this.getConnection().query(stmt, function (err, result) {
            if (err)
                throw err;

            if (echo === true) {

                out.log('\'' + stmt + '\' sucessfull!');

            }

        });



    }

    print = function () {
        return this.getOutputter().toString();
    }

}

module.exports = MySQLConnector;