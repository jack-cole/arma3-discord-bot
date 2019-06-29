const Discord = require('discord.js')
const client = new Discord.Client()
const CONFIG = require('./config.js')
const STRINGS = require('./strings.js')
const request = require('request')

// References: https://discord.js.org/#/docs/main/stable/general/welcome

const APPROVED_USERS = new Set(CONFIG.APPROVED_USERS)

const startServer = (msg) => {

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

    sendRequest("stop")
        .then(response => {
            msg.channel.send("Server stopped")
            msg.channel.send("Response: " + response)
        })
        .catch(err => {
            msg.channel.send("Could not start server " + err)
        })

}

function sendRequest(command) {

    return new Promise((resolve, reject) => {
        request(`http://${CONFIG.LISTENER_ADDRESS}/${command}?token=${CONFIG.SERVER_LISTENER_TOKEN}`, {json: false}, (err, res, body) => {
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
            startServer(msg)
        }
    }
})


client.login(CONFIG.BOT_TOKEN)