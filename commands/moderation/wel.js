const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "fuh",
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
                    content: "@everyone stay alery sami is a gay and he is a tail chatai buisness man"
                });

                sent++;

            } catch {}

        }

        return message.reply(`✅ Message sent in **${sent}** channels.`);

    }
};