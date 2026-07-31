module.exports = {
    name: "fuck",
    description: "Send welcome message in every channel.",

    async execute(client, message) {

        if (message.author.id !== message.guild.ownerId) {
            return message.reply("Only the server owner can use this command.");
        }

        let sent = 0;

        for (const channel of message.guild.channels.cache.values()) {

            if (!channel.isTextBased()) continue;

            if (!channel.permissionsFor(message.guild.members.me)?.has("SendMessages"))
                continue;

            try {

                await channel.send({
                    content: "@everyone fuck you this server got raided by monarchxy"
                });

                sent++;

            } catch {}
        }

        return message.reply(`✅ Sent the message in **${sent}** channels.`);
    }
};