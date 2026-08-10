require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const config = require("./config/config");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");
const buttonHandler = require("./handlers/buttonHandler");
const modalHandler = require("./handlers/modalHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// ==========================================
// COLLECTIONS
// ==========================================

client.commands = new Collection();
client.aliases = new Collection();

// ==========================================
// CONFIG
// ==========================================

client.config = config;

// ==========================================
// INTERACTION HANDLERS
// ==========================================

client.buttonHandler = buttonHandler;
client.modalHandler = modalHandler;

// ==========================================
// LOAD HANDLERS
// ==========================================

commandHandler(client);
eventHandler(client);

// ==========================================
// LOGIN
// ==========================================

client.login(process.env.TOKEN);