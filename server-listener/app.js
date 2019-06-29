const express = require('express')
const app = express()
const {exec} = require('child_process')


const CONFIG = require('./config.js')
const STRINGS = require('./strings.js')

function checkToken(req, res) {
    let token_is_valid = req.query.token !== CONFIG.LISTENER_TOKEN
    if (token_is_valid)
        res.send('Invalid token')
    return token_is_valid
}

function executeArma3ShellScriptCommand(command) {
    let fullCommand = `${CONFIG.ARMA3_SCRIPT_FILE} ${command}`
    return new Promise((resolve, reject) => {
        exec(fullCommand, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                reject(err)
            }

            // the *entire* stdout and stderr (buffered)
            resolve({stdout, stderr})
        })
    })
}

app.get('/start', (req, res) => {
    if(!checkToken(req, res))
        return;

    executeArma3ShellScriptCommand(+" start")
        .then(({stdout, stderr}) => {
            res.send("Successfully started Arma3 Server.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })
})

app.get('/stop', (req, res) => {
    if(!checkToken(req, res))
        return;

    executeArma3ShellScriptCommand(+" stop")
        .then(({stdout, stderr}) => {
            res.send("Successfully stopped Arma3 Server.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })
})

app.get('/install', (req, res) => {
    if(!checkToken(req, res))
        return;

    executeArma3ShellScriptCommand(+" install")
        .then(({stdout, stderr}) => {
            res.send("Successfully installed/updated Arma 3.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })
    res.send("Valid token!")

})

app.get('/mods', (req, res) => {
    if(!checkToken(req, res))
        return;

    executeArma3ShellScriptCommand(+" mods")
        .then(({stdout, stderr}) => {
            res.send("Successfully updated Arma 3 mods.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })

    res.send("Valid token!")

})


module.exports = app
