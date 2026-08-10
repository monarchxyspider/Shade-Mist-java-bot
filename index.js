require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

// ==========================================
// CONFIG
// ==========================================

const config = require("./config/config");

// ==========================================
// HANDLERS
// ==========================================

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");
const buttonHandler = require("./handlers/buttonHandler");

// ==========================================
// CLIENT
// ==========================================

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
// BUTTON HANDLER
// ==========================================

client.buttonHandler = buttonHandler;

// ==========================================
// LOAD COMMANDS
// ==========================================

commandHandler(client);

// ==========================================
// LOAD EVENTS
// ==========================================

eventHandler(client);

// ==========================================
// LOGIN
// ==========================================

client.login(process.env.TOKEN);