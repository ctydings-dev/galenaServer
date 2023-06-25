class Outputter {

    constructor() {
        this.clear();


    }

    getMessages = function () {
        return this.messages;
    }

    addMesage = function (msg, level) {

        var toAdd = {
            message: msg,
            level: level
        };


        this.getMessages().push(toAdd);


    }

    clear = function () {
        this.messages = [];
    }

    log = function (out) {

    }

    print = function (out) {

    }

    error = function (out) {

    }

    caution = function (out) {



    }

}
module.exports = Outputter;