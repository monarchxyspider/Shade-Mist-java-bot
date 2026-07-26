require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.aliases = new Collection();

client.prefix = "S!";

commandHandler(client);
eventHandler(client);

client.login(process.env.TOKEN);