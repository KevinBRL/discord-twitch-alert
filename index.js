require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        const event = require(`./events/${f}`);
        let eventName = f.split('.')[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.login(process.env.TOKEN);