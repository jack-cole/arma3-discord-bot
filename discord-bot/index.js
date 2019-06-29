const Discord = require('discord.js')
const client = new Discord.Client()
const CONFIG = require('./config.js')
const STRINGS = require('./strings.js')
const request = require('request')

// References: https://discord.js.org/#/docs/main/stable/general/welcome

const APPROVED_USERS = new Set(CONFIG.APPROVED_USERS)

const startServer = (msg) => {

    msg.channel.send("Starting server")
    sendRequest("start")
        .then(response => {
            msg.channel.send("Server started ")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could not stop server " + err)
        })


}


const stopServer = (msg) => {
    msg.channel.send("Stopping server")
    sendRequest("stop")
        .then(response => {
            msg.channel.send("Server stopped")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could not start server " + err)
        })

}

const modsServer = (msg) => {
    msg.channel.send("Listing server mods")
    sendRequest("mods")
        .then(response => {
            msg.channel.send("Server mods")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could not start server " + err)
        })

}
const installServer = (msg) => {

    msg.channel.send("Installing/Updating server")
    sendRequest("install")
        .then(response => {
            msg.channel.send("Server installed/updated")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could install/update server " + err)
        })

}
const installModsServer = (msg) => {

    msg.channel.send("Installing/Updating mods")
    sendRequest("installmods")
        .then(response => {
            msg.channel.send("Server mods installed")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could not install mods on server " + err)
        })

}

const helpMsg = (msg) => {
    msg.channel.send(STRINGS.HELP_MSG)
}


function sendRequest(command) {
    let request_url = `http://${CONFIG.LISTENER_ADDRESS}/${command}?token=${CONFIG.SERVER_LISTENER_TOKEN}`
    console.log(`sending request to ${request_url}`)
    return new Promise((resolve, reject) => {
        request(request_url, {json: false}, (err, res, body) => {
            if (err) {
                reject(err)
            }
            resolve(body)
        })
    })
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
        let user_name = `${msg.author.username}#${msg.author.discriminator}`
        if (msg.channel.name === CONFIG.CHANNEL_TO_MONITOR && APPROVED_USERS.has(user_name)) {

            let command = msg.content.split(" ")[0]

            if (command === STRINGS.COMMAND.START) {
                startServer(msg)
            } else if (command === STRINGS.COMMAND.STOP) {
                stopServer(msg)
            } else if (command === STRINGS.COMMAND.MODS) {
                modsServer(msg)
            } else if (command === STRINGS.COMMAND.INSTALL) {
                installServer(msg)
            } else if (command === STRINGS.COMMAND.INSTALL_MODS) {
                installModsServer(msg)
            } else if (command === STRINGS.COMMAND.HELP) {
                helpMsg(msg)
            }
        }
    }
)


client.login(CONFIG.BOT_TOKEN)