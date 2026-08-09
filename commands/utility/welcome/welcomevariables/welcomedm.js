const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig,
    setDMEnabled,
    setDMMessage
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-dm",
    aliases: ["welcomedm"],
    description: "Configure welcome direct messages.",

    async execute(client, message, args) {

        if (!message.guild) return;

        if (!message.member.permissions.has("ManageGuild")) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission.`
            });
        }

        const config =
            getConfig(message.guild.id);

        const action =
            args[0]?.toLowerCase();

        // ==============================
        // STATUS
        // ==============================

        if (!action) {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        config.dmEnabled
                            ? 0x57F287
                            : 0xED4245
                    )
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome DM`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `### Welcome DM\n\n` +
                        `**Status:** ${config.dmEnabled ? "🟢 Enabled" : "🔴 Disabled"}\n\n` +
                        `**Message:**\n` +
                        `> ${config.dmMessage || "Not configured"}\n\n` +
                        `Use:\n` +
                        `\`s!welcome-dm enable\`\n` +
                        `\`s!welcome-dm disable\``
                    )
                    .setTimestamp();

            return message.reply({
                embeds: [embed]
            });
        }

        // ==============================
        // ENABLE
        // ==============================

        if (action === "enable") {

            setDMEnabled(
                message.guild.id,
                true
            );

            return message.reply({
                content:
                    `${client.config.emojis.success || "✅"} **Welcome DM enabled.**`
            });
        }

        // ==============================
        // DISABLE
        // ==============================

        if (action === "disable") {

            setDMEnabled(
                message.guild.id,
                false
            );

            return message.reply({
                content:
                    `${client.config.emojis.success || "✅"} **Welcome DM disabled.**`
            });
        }

        // ==============================
        // SET MESSAGE
        // ==============================

        if (action === "message") {

            const text =
                args
                    .slice(1)
                    .join(" ")
                    .trim();

            if (!text) {
                return message.reply({
                    content:
                        `${client.config.emojis.error} Please provide the DM message.\n\n` +
                        `Example: \`s!welcome-dm message Welcome {user.mention}!\``
                });
            }

            setDMMessage(
                message.guild.id,
                text
            );

            return message.reply({
                content:
                    `${client.config.emojis.success || "✅"} **Welcome DM message updated.**`
            });
        }

        return message.reply({
            content:
                `${client.config.emojis.error} Unknown option.\n\n` +
                `Use \`enable\`, \`disable\`, or \`message\`.`
        });
    }
};