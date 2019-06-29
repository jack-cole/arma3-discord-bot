const Discord = require('discord.js')
const client = new Discord.Client()
const CONFIG = require('./config.js')
const STRINGS = require('./strings.js')

// References: https://discord.js.org/#/docs/main/stable/general/welcome

const APPROVED_USERS = new Set(CONFIG.APPROVED_USERS)

const startServer = (msg) => {

    msg.reply("Server started")
}

const stopServer = (msg) => {

    msg.reply("Server stopped")
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
        }


    }
})


client.login(CONFIG.BOT_TOKEN)