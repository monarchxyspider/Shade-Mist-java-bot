require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const config = require("./config/config");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.aliases = new Collection();

client.config = config;

commandHandler(client);
eventHandler(client);

client.login(process.env.TOKEN);