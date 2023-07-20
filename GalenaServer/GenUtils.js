


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

}


module.exports = GenUtils;