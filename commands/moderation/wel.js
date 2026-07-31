const {
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "clone",
    aliases: ["copy"],
    description: "Clone a text channel.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply("❌ You need the **Manage Channels** permission.");
        }

        const channel =
            message.mentions.channels.first() ||
            message.channel;

        try {

            const cloned = await channel.clone({
                name: channel.name,
                reason: `Cloned by ${message.author.tag}`
            });

            await cloned.setPosition(channel.position + 1);

            return message.reply(
                `✅ Successfully cloned ${channel}.\nNew Channel: ${cloned}`
            );

        } catch (err) {

            console.error(err);

            return message.reply("❌ Failed to clone the channel.");

        }

    }
};