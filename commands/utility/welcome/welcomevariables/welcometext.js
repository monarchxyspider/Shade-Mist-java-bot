const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig,
    setMessage
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-text",
    aliases: ["welcometext"],
    description: "Configure the welcome text message.",

    async execute(client, message, args) {

        if (!message.guild) return;

        if (!message.member.permissions.has("ManageGuild")) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission.`
            });
        }

        const action =
            args[0]?.toLowerCase();

        const config =
            getConfig(message.guild.id);

        // ==============================
        // SHOW CURRENT TEXT
        // ==============================

        if (!action) {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        client.config.embedColor
                    )
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome Text`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `### Current Welcome Text\n\n` +
                        `> ${config.message || "Not configured"}\n\n` +
                        `**Usage:**\n` +
                        `\`s!welcome-text <message>\``
                    )
                    .setFooter({
                        text:
                            "Variables such as {user.mention} are supported."
                    })
                    .setTimestamp();

            return message.reply({
                embeds: [embed]
            });
        }

        // ==============================
        // SET TEXT
        // ==============================

        const text =
            args
                .join(" ")
                .trim();

        if (!text) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please provide a welcome message.`
            });
        }

        setMessage(
            message.guild.id,
            text
        );

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x57F287)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome Text`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success || "✅"} **Welcome text updated successfully.**\n\n` +
                        `**New Message:**\n` +
                        `> ${text}`
                    )
                    .setFooter({
                        text:
                            "Welcome variables are supported."
                    })
                    .setTimestamp()
            ]
        });
    }
};