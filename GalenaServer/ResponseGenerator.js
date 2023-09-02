
class ResponseGenerator {

    constructor() {

    }

    createBasicResponse = function (value, type) {
        var time = Date.now();
        var ret = {

            value: value,
            time: time,
            type: type,

            isString: false,
            isNumber: false,
            isImage: false,
            isTable: false

        };



        return ret;
    }

    createStringResponse = function (value) {
        var ret = this.createBasicResponse(value, 'TEXT');

        return ret;
    }

    createStringListResponse = function (value) {
        var ret = this.createBasicResponse(value, 'TEXT_LIST');

        return ret;
    }

    createErrorResponse = function (value) {

        var ret = this.createBasicResponse(value, 'ERROR');
        return ret;
    }

}

var resGen = new ResponseGenerator();
module.exports = resGen;
