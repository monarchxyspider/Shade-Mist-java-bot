const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageDelete,

    async execute(message) {

        if (message.partial) return;
        if (!message.guild) return;
        if (message.author?.bot) return;

        const client = message.client;

        if (!client.snipes)
            client.snipes = new Map();

        client.snipes.set(message.channel.id, {
            content: message.content || "No message content.",
            author: message.author,
            attachments: [...message.attachments.values()],
            stickers: [...message.stickers.values()],
            createdTimestamp: message.createdTimestamp,
            deletedTimestamp: Date.now()
        });

    }
};