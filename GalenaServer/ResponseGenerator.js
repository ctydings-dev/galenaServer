
class ResponseGenerator {

    constructor() {

    }

    createBasicResponse = function (value) {
        var time = Date.now();
        var ret = {

            value: value,
            time: time,

            isString: false,
            isNumber: false,
            isImage: false,
            isTable: false

        };



        return ret;
    }

    createStringResponse = function (value) {
        var ret = this.createBasicResponse(value);
        ret.isString = true;
        return ret;
    }

}

var resGen = new ResponseGenerator();
module.exports = resGen;
