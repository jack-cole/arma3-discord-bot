class Arma3Status {

    static get COMMAND_STATE() {
        return {
            IN_PROGRESS: "IN_PROGRESS",
            DONE: "DONE",
            ERROR: "ERROR",
        }
    }

    static get SERVER_STATE() {
        return {
            ONLINE: "ONLINE",
            OFFLINE: "OFFLINE",
        }
    }

    constructor({action, command_state, message, server_state}) {
        this._action = action
        this._command_state = command_state
        this._message = message
        this._server_state = server_state
    }

    get message() {
        return this._message
    }


    get status() {
        return this._status
    }



    get action() {
        return this._action
    }


    get command_state() {
        return this._command_state
    }


    get server_state() {
        return this._server_state
    }


}


module.exports = Arma3Status