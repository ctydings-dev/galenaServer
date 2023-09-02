

class User {

    constructor(user, password, passCheck, permissions)
    {
        this.valid = password === passCheck;
        this.user = user;
        this.permissions = permissions;

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

}
module.exports = User;