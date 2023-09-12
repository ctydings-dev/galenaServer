class TableResponse {

    constructor(cols) {
        this.cols = cols;
        this.rows = [];
        this.type = 'TABLE';
    }

    getCols = function () {
        return this.cols;
    }

    getRows = function () {
        return this.rows;
    }

    addRow = function (toAdd) {
        this.getRows().push(toAdd);
    }
    getType = function () {
        return this.type;
    }

}

module.exports = TableResponse;