

var cmdResponse = require('../CommandResponse.js');

var base = require('../GalenaModule.js');
var sqlConnection = require('./MySQLConnector.js');
var resGen = require('../ResponseGenerator.js');
var TableResponse = require('../TableResponse.js');


class SQLModule extends base {

    constructor(address) {
        super('SQL');
        this.address = address;
        this.database = null;
        this.connections = [];
    }
    getAddress = function () {
        return this.address;
    }

    getDatabase = function(){
        return this.database;
    }

    setDatabase = function(toSet){
        this.database = toSet;
    }

    createConnection = function (dbName, user, password) {

        var ret = new sqlConnection(this.getAddress(), user, password, dbName);
        return ret;


    }

    executeCommand = function (payload, req, res, caller, user) {

        var type = payload.args[0].trim().toUpperCase();
        var session = payload.session;
        if (type === 'SQL_TABLE_DUMP') {

            if (user.permitSQLDump() !== true) {
                var response = resGen.createErrorResponse('User does not have SQL dump privilages!');

                caller.sendResponse(response, session, res);
                return;
            }
            this.sqlTableDump(payload, req, res, caller);
            return;
        }


if(type === "USE"){
if(payload.args.length !== 2){
    var response = resGen.createErrorResponse('USE has two arguments!');

    caller.sendResponse(response, session, res);
    return;

}
    
    this.setDatabase(payload.args[1].trim());
    var response = resGen.createStringResponse('Database set to ' + this.getDatabase());

    caller.sendResponse(response, session, res);
    return;
}


if(this.getDatabase() === null){
    var response = resGen.createErrorResponse('No database selected!');

    caller.sendResponse(response, session, res);
    return;


}


let stmt = payload.command;
try{
this.runSQLStatement(this.getDatabase(),stmt,payload, req,res,caller)
}
catch(err){

    var response = resGen.createErrorResponse('SERVER ERROR!');

    caller.sendResponse(response, session, res);
    return;

}











//var response = resGen.createStringResponse('CMD executed ' + this.getDatabase());

//caller.sendResponse(response, session, res);
return;

    }

    sqlTableList = function (payload, req, res, caller) {

        if (payload.args.length !== 2) {
            var ret = resGen.createErrorResponse('Database name must be provided for listing!');

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
        callbackCaller.sendErrorResponse = function (msg) {

            var ret = resGen.createErrorResponse(msg);


            var response = this.controller.encryptPayload(this.session, ret);

            this.res.send(response);


        };

        callbackCaller.process = function (value) {
            var response = new TableResponse(['TABLE NAME']);

            for (var prop in value) {

                response.addRow([value[prop]]);
            }




            //  var response = resGen.createStringListResponse(value);
            response = this.controller.encryptPayload(this.session, response);

            this.res.send(response);

            console.log('DONE');

        };


        //  callbackCaller.sql = this.getConnection(dbName);
        callbackCaller.sql = this.createConnection(dbName, payload.user, payload.password);



        callbackCaller.sql.showTables(callbackCaller, 'process');











    }

    runSQLStatement = function(db, stmt,payload,req,res, caller){

        

        var callbackCaller = {

        };


        callbackCaller.parent = this;
        callbackCaller.controller = caller;
        callbackCaller.session = payload.session;
        callbackCaller.res = res;

        callbackCaller.sendErrorResponse = function (msg) {
            var ret = resGen.createErrorResponse(msg);
            var response = this.controller.encryptPayload(this.session, ret);
            this.res.send(response);
        };

callbackCaller.error = function(err){


this.sendErrorResponse(err.sqlMessage);


}


        callbackCaller.process = function (value) {

if(value.length < 1){
    
var response = resGen.createStringResponse('CMD executed ' + this.getDatabase());

caller.sendResponse(response, session, res);
}

var cols = [];
for(var prop in value[0]){
    cols.push(prop);
}
var rows = [];

for(var x = 0; x < value.length; x++){
var row = [];
    for(var y = 0; y < cols.length; y++){
row.push(value[x][cols[y]]);

}
rows.push(row);

}

          //  var cmds = value.getCreateStatements();
        //    var ret = new cmdResponse('SQL', cmds);
          //  ret.setPrelim(value.rowData.getCreate());
            var response = new TableResponse(cols);
            response.rows = rows;
            response = this.controller.encryptPayload(this.session, response);
            this.res.send(response);
            console.log('DONE');

        };


//        callbackCaller.sql = this.getConnection(dbName);
        callbackCaller.sql = this.createConnection(db, payload.user, payload.password);
       


        callbackCaller.sql.executeStatement(stmt,  callbackCaller, 'process');

        return;



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



        if (tableName === '*')
        {

            this.sqlTableDumpAll(payload, req, res, caller);
            return;
        }



        var callbackCaller = {

        };


        callbackCaller.parent = this;
        callbackCaller.controller = caller;
        callbackCaller.session = payload.session;
        callbackCaller.res = res;

        callbackCaller.sendErrorResponse = function (msg) {
            var ret = resGen.createErrorResponse(msg);
            var response = this.controller.encryptPayload(this.session, ret);
            this.res.send(response);
        };

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

    sqlTableDumpAll = function (payload, req, res, caller) {

        if (payload.args.length !== 3) {
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
        callbackCaller.sendErrorResponse = function (msg) {
            var ret = resGen.createErrorResponse(msg);
            var response = this.controller.encryptPayload(this.session, ret);
            this.res.send(response);
        };


        callbackCaller.process = function (value) {

            if (value.length < 1)
            {
                this.sendErrorResponse('No tables found!');


                return;
            }

            var cmds = value[0].getCreateStatements();
            var ret = new cmdResponse('SQL', cmds);

            ret.setPrelim(value[0].rowData.getCreate());


            for (var index = 1; index < value.length; index++) {

                ret.addToCommands(value[index].getCreateStatements());
                ret.addToPrelim(value[index].rowData.getCreate());
            }

            var response = ret.createResponses();
            response = this.controller.encryptPayload(this.session, response);
            this.res.send(response);
        };


        callbackCaller.sql = this.createConnection(dbName, payload.user, payload.password);
        callbackCaller.sql.showTables(callbackCaller, 'process', true);
    }

    sqlStatement = function (payload, req, res, caller) {

        if (payload.args.length < 3) {


            return;
        }

        var db = payload.args[1];


        var statement = '';


        for (var index = 2; index < payload.args.length; index++) {
            statement = statement + payload.args[index] + ' ';
        }

       this.runSQLStatement(db, statement,req, res,caller);
    }

}




module.exports = SQLModule;