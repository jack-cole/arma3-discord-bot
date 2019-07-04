class Arma3Response {

    static get RESULT() {
        return {
            SUCCESS: "SUCCESS",
            ERROR: "ERROR",
        }
    }


    constructor(result, status) {
        this._result = result
        this._status = status
    }


    get status() {
        return this._status
    }



    get result() {
        return this._result
    }



}


module.exports = Arma3Response