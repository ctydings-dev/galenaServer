class CommandResponse {

    constructor(mode, commands) {
        this.mode = mode;
        this.commands = commands;
        this.prelim = [];
    }

    getCommands = function () {
        return this.commands;
    }

    setPrelim = function (toSet) {
        this.prelim = toSet;
    }

    getCommandSize = function () {
        return this.getCommands().length;
    }

    createResponses = function (maxSize) {

        if (maxSize === null || maxSize === undefined) {

            maxSize = this.getCommandSize() + 1;
        }

        var ret = [];

        if (maxSize >= this.getCommandSize()) {
            ret.push(this.createResponse());

        } else {

            for (var index = 0; index < this.getCommandSize(); index += maxSize) {

                var toAdd = this.createResponse(index, index + maxSize);
                toAdd.index = index;
                ret.push(toAdd);


            }
        }


        return JSON.stringify(ret);



    }

    createResponse = function (start, end) {

        if (start === null || start === undefined) {
            start = 0;
        }

        if (end === null || end === undefined) {
            end = 0;
        }

        var toSend = [];


        if (start === 0 && end === 0) {

            toSend = this.getCommands();

        } else
        {

            for (var index = start; index < end; index++) {
                toSend.push(this.getCommands()[index]);


            }





        }


        var mode = this.mode;

        var ret = {
            type: 'COMMAND',
            mode: mode,
            start: start,
            end: end,
            preliminaryCommands: this.prelim,
            commands: toSend
        };

        return ret;

    }

}
;
module.exports = CommandResponse;
