const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-config",
    aliases: ["welcomeconfig"],
    description: "Show the current welcome configuration.",

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

        const config =
            getConfig(message.guild.id);

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.enabled
                        ? 0x57F287
                        : 0xED4245
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Welcome Config`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
                    `### Welcome System\n\n` +
                    `**Status:** ${config.enabled ? "🟢 Enabled" : "🔴 Disabled"}\n` +
                    `**Channel:** ${config.channelId ? `<#${config.channelId}>` : "`Not set`"}\n` +
                    `**DM:** ${config.dmEnabled ? "🟢 Enabled" : "🔴 Disabled"}`
                )
                .addFields(
                    {
                        name: "Message",
                        value:
                            `> ${config.message || "Not configured"}`
                    },
                    {
                        name: "Embed Title",
                        value:
                            `> ${config.embed?.title || "Not configured"}`,
                        inline: true
                    },
                    {
                        name: "Embed Colour",
                        value:
                            `> \`${config.embed?.color || "#5865F2"}\``,
                        inline: true
                    },
                    {
                        name: "Buttons",
                        value:
                            `> ${config.buttons?.length || 0}/5`,
                        inline: true
                    }
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome Configuration`
                })
                .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};