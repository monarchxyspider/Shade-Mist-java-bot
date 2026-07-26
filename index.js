import {
  Client,
  GatewayIntentBits,
  Collection,
  Events
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

client.once(Events.ClientReady, (client) => {
  console.log("==================================");
  console.log(`Logged in as ${client.user.tag}`);
  console.log("❤️ ShadeMist is Online!");
  console.log("==================================");
});

client.login(process.env.TOKEN);