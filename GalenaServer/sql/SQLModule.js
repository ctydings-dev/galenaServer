

var cmdResponse = require('../CommandResponse.js');

var base = require('../GalenaModule.js');
var sqlConnection = require('./MySQLConnector.js');
var resGen = require('../ResponseGenerator.js');


class SQLModule extends base {

    constructor(address) {
        super('SQL');
        this.address = address;

        this.connections = [];
    }
    getAddress = function () {
        return this.address;
    }

    createConnection = function (dbName, user, password) {

        var ret = new sqlConnection(this.getAddress(), user, password, dbName);
        return ret;


    }

    executeCommand = function (payload, req, res, caller) {

        console.log(payload.user + " : " + payload.password);
        var type = payload.args[0].trim().toUpperCase();
        if (type === 'SQL_TABLE_DUMP') {
            this.sqlTableDump(payload, req, res, caller);
            return;
        }


        if (type === 'SQL_TABLE_LIST') {
            this.sqlTableList(payload, req, res, caller);
            return;
        }






        //  throw 'Command not recognized!';
        var session = payload.session;

        var response = resGen.createErrorResponse('Command ' + type + ' is not recognized!');

        caller.sendResponse(response, session, res);



    }

    sqlTableList = function (payload, req, res, caller) {

        if (payload.args.length !== 2) {
            var ret = resGen.createErrorResponse('Database name must be provided!');

            var session = payload.session;
            caller.sendResponse(ret, session, res);
            return;
        }




        var dbName = payload.args[1];
        var callbackCaller = {

        };

        callbackCaller.parent = this;
        callbackCaller.controller = caller;
        callbackCaller.session = payload.session;
        callbackCaller.res = res;

        callbackCaller.process = function (value) {





            var response = resGen.createStringListResponse(value);
            response = this.controller.encryptPayload(this.session, response);

            this.res.send(response);

            console.log('DONE');

        };


        //  callbackCaller.sql = this.getConnection(dbName);
        callbackCaller.sql = this.createConnection(dbName, payload.user, payload.password);



        callbackCaller.sql.showTables(callbackCaller, 'process');











    }

    sqlTableDump = function (payload, req, res, caller) {
        console.log('GETTING DUMP');

        if (payload.args.length !== 3) {
            var ret = resGen.createErrorResponse('Table dump request must include the db name and table name!');

            var session = payload.session;
            caller.sendResponse(ret, session, res);
            return;
        }

        var tableName = payload.args[2];
        var dbName = payload.args[1];
        var callbackCaller = {

        };

        callbackCaller.parent = this;
        callbackCaller.controller = caller;
        callbackCaller.session = payload.session;
        callbackCaller.res = res;

        callbackCaller.process = function (value) {


            var cmds = value.getCreateStatements();
            var ret = new cmdResponse('SQL', cmds);

            ret.setPrelim(value.rowData.getCreate());


            var response = ret.createResponses();

            response = this.controller.encryptPayload(this.session, response);

            this.res.send(response);

            console.log('DONE');

        };


//        callbackCaller.sql = this.getConnection(dbName);
        callbackCaller.sql = this.createConnection(dbName, payload.user, payload.password);
        callbackCaller.tableName = tableName;



        callbackCaller.sql.getTableStructure(tableName, false, callbackCaller, 'process');

        return;
    }

}




module.exports = SQLModule;