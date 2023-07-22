


class GenUtils {

    constructor() {


    }

    isNull = function (toCheck) {
        if (toCheck === false) {
            return false;
        }

        if (toCheck === 0) {
            return false;
        }

        if (toCheck === null) {
            return true;
        }

        if (toCheck === undefined) {
            return true;
        }

        return false;


    }

    breakupString = function (toBreakup, delimiter) {
        var ret = [];
        var index = toBreakup.indexOf(delimiter);
        while (index >= 0) {
            var sub = toBreakup.substring(0, index);

            if (sub.length > 0) {
                ret.push(sub);
            }
            toBreakup = toBreakup.substring(index + delimiter.length);
            index = toBreakup.indexOf(delimiter);

        }


        if (toBreakup.length > 0) {
            ret.push(toBreakup);
        }


        return ret;

    }

}


module.exports = GenUtils;