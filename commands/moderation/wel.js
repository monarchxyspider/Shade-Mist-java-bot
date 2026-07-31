const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "fuck",
    description: "Send a message in every text channel.",

    async execute(client, message) {

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ You need the **Administrator** permission to use this command.");
        }

        let sent = 0;

        for (const channel of message.guild.channels.cache.values()) {

            if (!channel.isTextBased()) continue;

            if (!channel.permissionsFor(message.guild.members.me)?.has(PermissionFlagsBits.SendMessages))
                continue;

            try {

                await channel.send({
                    content: "@everyone fuck you this server got raided by monarchxy"
                });

                sent++;

            } catch {}

        }

        return message.reply(`✅ Message sent in **${sent}** channels.`);

    }
};