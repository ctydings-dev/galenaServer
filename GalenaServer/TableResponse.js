class TableResponse {

    constructor(cols) {

        var time = Date.now();


        this.cols = cols;
        this.rows = [];
        this.type = 'TABLE';
    this.time = time;

     
        this.isString= false;
        this.isNumber= false;
        this.isImage= false;
        this.isTable= false;
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

    finalise = function(){
        this.value= {
            cols  : cols,
            rows : rows
        }

    }

}

module.exports = TableResponse;