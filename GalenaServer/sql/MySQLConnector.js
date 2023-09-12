
var base = require('./SQLConnector.js');
var User = require('../User.js');
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


            if (err === true)
                throw err;
            out.log("Connected to MySQL Server!");
        });
        var db = this.getDB();
        var sql = 'USE  ' + db;


        this.executeStatement(sql);
        out.log('Using database ' + db);


    }

    getUserInformation = function (user, password, caller, session) {

        var stmt = 'SELECT * FROM user AS usr INNER JOIN sql_privilage AS sp ON usr.id = sp.user INNER JOIN cmd_privilage AS cp ON usr.id=cp.user WHERE usr.user =\'';
        stmt = stmt + user + '\' ;';

        this.getConnection().query(stmt, function (err, result) {
            if (err) {
                var msg = err.sqlMessage;

                caller.sendErrorResponse(msg);
                return false;

            }

            var data = result[0];

            var toAdd = new User(user, password, data.password, data);

            caller.getRSAKeyBank()[session].user = toAdd;


        });









    }

    showTables = function (callbackCaller, callback, loadAll) {

        var out = this.getOutputter();
        var stmt = "SHOW TABLES;";
        var ret = [];


        if (loadAll !== true) {
            loadAll = false;
        }
        var sql = this;
        this.getConnection().query(stmt, function (err, result) {
            if (err)
            {
                var msg = err.sqlMessage;

                callbackCaller.sendErrorResponse(msg);
                return false;
            }



            if (loadAll === true) {

                for (var prop in result) {

                    var toAdd = result[prop];

                    for (var sub in toAdd) {
                        toAdd = toAdd[sub];

                    }
                    ret.push(toAdd);


                }

                var interior = {

                    index: 0,
                    tables: ret,
                    data: [],
                    caller: callbackCaller,
                    callbackMethod: callback,
                    sql: sql,
                    callbackInt: function (toAdd) {

                        if (toAdd === false) {
                            return;
                        }

                        if (toAdd !== false && toAdd !== undefined) {

                            this.data.push(toAdd);
                        }


                        if (this.index >= this.tables.length) {


                            this.caller[this.callbackMethod](this.data);
                            return;

                        }
                        var tableName = this.tables[this.index];
                        this.index++;

                        this.sql.getTableStructure(tableName, false, this, 'callbackInt');


                    }
                }





                interior.callbackInt();



                return;
            }









            for (var prop in result) {
                var toAdd = result[prop];

                for (var sub in toAdd) {
                    toAdd = toAdd[sub];
                }
                ret.push(toAdd);

            }

            callbackCaller[callback](ret);





        });
    }

    getTableData = function (rowData, callbackCaller, callback, previous) {


        var out = this.getOutputter();
        var stmt = "SELECT * FROM " + rowData.name + ";";
        var ret;

        if (previous === undefined) {
            ret = [];
            previous = false;


        }




        this.getConnection().query(stmt, function (err, result) {


            var data = [];


            for (var prop in result) {

                var entry = result[prop];
                var row = {};
                for (var field in entry) {
                    var value = entry[field];
                    var toAdd = {
                        name: field,
                        value: value
                    }

                    row[field] = toAdd;
                }
                data.push(row);


            }

            var ret = {
                rowData: rowData,
                data: data,
                getCreateStatements: function () {
                    var ret = [];

                    for (var index = 0; index < this.data.length; index++) {
                        var toAdd = this.rowData.getInsert(this.data[index]);

                        ret.push(toAdd);
                    }
                    return ret;

                }

            };





            callbackCaller[callback](ret);


        });




    }

    getTableStructure = function (name, echo, callbackCaller, callback)
    {

        if (echo !== true) {
            echo = false;
        }
        var out = this.getOutputter();
        var stmt = "SHOW COLUMNS IN " + name + ';';
        var ret = [];
        var tableName = name;
        var caller = this;
        this.getConnection().query(stmt, function (err, result) {
            if (err)
            {
                var msg = err.sqlMessage;

                callbackCaller.sendErrorResponse(msg);
                return false;


            }

            if (echo === true) {
                out.log('\'' + stmt + '\' sucessfull!');
            }


            var rows = {};
            for (var prop in result) {
                var row = result[prop];

                var name = row.Field;
                var type = row.Type;
                if (type === 'tinyint(1)') {
                    type = 'BOOLEAN';
                }
                if (type === 'int') {
                    type = 'INTEGER';
                }
                type = type.toUpperCase();

                var nullAble = row.Null;
                var priKey = row.Key;
                var extra = row.Extra;
                var toAdd = {
                    name: name,
                    type: type,
                    nullAble: nullAble,
                    key: priKey,
                    extra: extra,
                    toString: function () {

                        var ret = '' + this.name + ' ' + this.type;

                        if (this.key === 'PRI') {
                            ret = ret + ' PRIMARY KEY';
                        }

                        if (this.nullAble === 'YES') {
                            ret = ret + ' NOT NULL';

                        }

                        if (this.extra.indexOf('auto_increment') >= 0) {
                            //    ret = ret + ' AUTO_INCREMENT';

                        }

                        return ret;
                    }
                };
                rows[name] = toAdd;


            }

            var ret = {
                rows: rows,
                name: tableName,
                getCreate: function () {
                    var ret = [];
                    var line = 'DROP TABLE IF EXISTS ' + this.name + ';';
                    ret.push(line);
                    line = 'CREATE TABLE ' + this.name + '(';
                    for (var index in this.rows) {

                        line = line + this.rows[index].toString() + ',';
                    }

                    line = line.substring(0, line.length - 1);
                    line = line + ');';

                    ret.push(line);
                    return ret;
                },

                getInsert: function (data) {


                    var ret = 'INSERT INTO ' + this.name + '(';

                    for (var name in data) {

                        ret = ret + name + ',';

                    }

                    ret = ret.substring(0, ret.length - 1);

                    ret = ret + ') VALUES (';

                    for (var name in data) {

                        var parsed = this.getDataValue(data[name]);
                        ret = ret + parsed + ',';
                    }
                    ret = ret.substring(0, ret.length - 1);
                    ret = ret + ');';

                    return ret;
                },

                getDataValue: function (data) {
                    var value = data.value;
                    var row = this.rows[data.name];


                    if (row.type.indexOf('VARCHAR') >= 0) {

                        value = "'" + value + "'";
                    }

                    if (row.type.indexOf('BOOLEAN') >= 0) {

                        if (value === 0) {
                            value = 'TRUE';
                        } else
                        {
                            value = 'FALSE';
                        }


                    }


                    return value;




                }


            };


            caller.getTableData(ret, callbackCaller, callback);

        });
    }

    executeStatement = function (stmt, caller, callback) {


        var out = this.getOutputter();
        out.log('Executing Statement: ' + stmt);
        this.getConnection().query(stmt, function (err, result) {


            if (err)
            {

                throw err;


            }

            if (caller !== undefined) {
                // caller[callback](result);
            }


        });



    }

    print = function () {
        return this.getOutputter().toString();
    }

}

module.exports = MySQLConnector;