const express = require('express')
const app = express()
const {exec} = require('child_process')
const Arma3Response = require('./model/Arma3Response')
const Arma3Status = require('./model/Arma3Status')
const HttpStatus = require('http-status-codes');


const CONFIG = require('./config.js')
const STRINGS = require('./strings.js')

function checkToken(req, res) {
    let token_is_valid = req.query.token === CONFIG.LISTENER_TOKEN
    console.log(`Token ${token_is_valid ? "is" : "isn't"} valid`)
    if (!token_is_valid)
        res.send('Invalid token')
    return token_is_valid
}

function executeArma3ShellScriptCommand(command) {
    let fullCommand = `${CONFIG.ARMA3_SCRIPT_FILE} ${command}`
    console.log("Executing command", fullCommand)
    return new Promise((resolve, reject) => {
        exec(fullCommand, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log(`Could not execute command ${err}`)
                reject(err)
            } else {

                // the *entire* stdout and stderr (buffered)
                console.log(`Command executed.`)
                console.log(stdout)
                console.error(stderr)
                resolve({stdout, stderr})
            }
        })
    })
}

function execute(command){
    return executeArma3ShellScriptCommand(command)
        .then(({response,stderr}) => {
            return executeArma3ShellScriptCommand("status")
        })
        .then(({response,stderr}) => {
            console.log("Status retrieved", response)
            return Arma3Status(JSON.parse(response))
        })
}

app.get('/start', (req, res) => {
    if (!checkToken(req, res))
        return

    execute("start")
        .then((response_obj) => {
            res.send(new Arma3Response(Arma3Response.RESULT.SUCCESS, response_obj))
        })
        .catch(err => {
            console.error("Error during execution of start: ", err)
            res.set(HttpStatus.INTERNAL_SERVER_ERROR).send(new Arma3Response(Arma3Response.RESULT.ERROR, null))
        })
})

app.get('/stop', (req, res) => {
    if (!checkToken(req, res))
        return

    execute("stop")
        .then((response_obj) => {
            res.send(new Arma3Response(Arma3Response.RESULT.SUCCESS, response_obj))
        })
        .catch(err => {
            console.error("Error during execution of stop: ", err)
            res.set(HttpStatus.INTERNAL_SERVER_ERROR).send(new Arma3Response(Arma3Response.RESULT.ERROR, null))
        })
})

app.get('/install', (req, res) => {
    console.log(`Received install request`)
    if (!checkToken(req, res))
        return

    executeArma3ShellScriptCommand("install")
        .then(({stdout, stderr}) => {
            res.send("Successfully installed/updated Arma 3.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })

})

app.get('/health', (req, res) => {
    console.log(`Received health request`)
    if (!checkToken(req, res))
        return

    executeArma3ShellScriptCommand("health")
        .then(({stdout, stderr}) => {
            if (stderr) console.error(stderr)
            console.log(stdout)
            res.send(stdout)
        })
        .catch(err => {

            console.error(err)
            res.send(err)
        })

})

app.get('/mods', (req, res) => {
    console.log(`Received mods request`)
    if (!checkToken(req, res))
        return

    executeArma3ShellScriptCommand("mods")
        .then(({stdout, stderr}) => {
            res.send("Successfully updated Arma 3 mods.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })

})


module.exports = app
