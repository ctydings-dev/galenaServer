const http = require('http');
const port = 9900;
var mod = require('./sql/MySQLConnector.js');
test = new mod('localhost', 'root', 'Per@grin1', 'test_db');

const requestHandler = (request, response) => {
    let funcName = "requestHandler";
    if (request.method === 'GET' && request.url === '/') {
        dumpMessage(funcName, "Request Method: GET - request URL: " + request.url);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end('Hello Node.js Server - at:  ' + getTime() + '!' + test.getDB());
    }
};



const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    let funcName = "server.listen";
    if (err) {
        return console.log(funcName, 'something bad happened: ' + err);
    }

    dumpMessage(funcName, 'server is listening on port: ' + port);
});

function dumpMessage(testName, mesg) {
    console.log(getTime() + testName + ":: --> " + mesg);
}
;

function getTime() {
    var ts = new Date();
    return ts.toLocaleTimeString() + ":" + ts.getMilliseconds() + "  ";
}
;