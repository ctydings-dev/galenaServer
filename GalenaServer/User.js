
class User {

    constructor() {
        this.admin = false;
        this.sql = false;




    }

    allowAdmin = function () {
        return this.admin === true;
    }

    allowSQL = function () {
        return this.sql === true;
    }

}




module.exports = User;