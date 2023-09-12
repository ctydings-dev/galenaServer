const bcrypt = require('bcrypt');

class User {

    constructor(user, password, passCheck, permissions)
    {
        this.valid = false;
        this.user = user;
        this.permissions = permissions;

        var caller = this;
        bcrypt.compare(password, passCheck, function (err, result) {

            if (result === true) {
                caller.valid = true;
            }
        });






    }

    isValid = function () {
        return this.valid;
    }

    getUser = function () {
        return this.user;
    }

    getPermissions = function () {
        return this.permissions;
    }

    permitRSACommand = function () {

        var toCheck = this.getPermissions().permit_rsa_request;



        if (this.isValid() !== true) {
            return false;
        }

        return  toCheck === 1;
    }

    permitSQLDump = function () {
        if (this.isValid() !== true) {
            return false;
        }



        return this.getPermissions().permit_table_dump === 1;
    }

    permitSQLTableList = function () {

        if (this.isValid() !== true) {
            return false;
        }

        var value = this.getPermissions().permit_table_list;
        var ret = value === 1;
        return ret;



    }

}
module.exports = User;