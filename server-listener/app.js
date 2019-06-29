const express = require('express')
const app = express()
const {exec} = require('child_process')


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
    console.log(`Executing command${fullCommand}`)
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

app.get('/start', (req, res) => {
    if (!checkToken(req, res))
        return

    executeArma3ShellScriptCommand("start")
        .then(({stdout, stderr}) => {
            res.send("Successfully started Arma3 Server.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
        })
})

app.get('/stop', (req, res) => {
    console.log(`Received stop request`)
    if (!checkToken(req, res))
        return

    executeArma3ShellScriptCommand("stop")
        .then(({stdout, stderr}) => {
            res.send("Successfully stopped Arma3 Server.")
        })
        .catch(err => {
            res.send("Could not run command on server. " + err)
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
