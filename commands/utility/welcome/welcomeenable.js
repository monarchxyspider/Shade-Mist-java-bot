const {
    EmbedBuilder
} = require("discord.js");

const {
    setEnabled
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-enable",
    aliases: ["welcomeenable"],
    description: "Enable the welcome system.",

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
            true
        );

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x57F287)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome System`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success || "✅"} **Welcome system enabled!**\n\n` +
                        `New members can now receive welcome messages.`
                    )
                    .setTimestamp()
            ]
        });
    }
};