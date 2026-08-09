const {
    EmbedBuilder
} = require("discord.js");

const {
    setEnabled
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-disable",
    aliases: ["welcomedisable"],
    description: "Disable the welcome system.",

    async execute(client, message) {

        if (!message.guild) return;

        if (
            !message.member.permissions.has("ManageGuild")
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission.`
            });
        }

        setEnabled(
            message.guild.id,
            false
        );

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome System`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success || "✅"} **Welcome system disabled.**\n\n` +
                        `New members will no longer receive welcome messages.`
                    )
                    .setTimestamp()
            ]
        });
    }
};