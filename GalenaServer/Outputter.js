class Outputter {

    constructor() {
        this.clear();


    }

    getMessages = function () {
        return this.messages;
    }

    addMessage = function (msg, level) {

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

        this.addMessage(out, 'LOG');

    }

    print = function (out) {
        this.addMessage(out, 'PRINT');
    }

    error = function (out) {
        this.addMessage(out, 'ERROR');
    }

    caution = function (out) {
        this.addMessage(out, 'CAUTION');


    }

    toString = function () {
        var ret = '';

        for (var index = this.getMessages().length - 1; index >= 0; index--) {
            var msg = this.getMessages()[index];
            var toAdd = msg.level + ' : ' + msg.message + '\n';
            ret = ret + toAdd;
        }
        return ret;


    }

}
module.exports = Outputter;