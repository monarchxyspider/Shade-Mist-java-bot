const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getConfig
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome",
    aliases: ["welcomesetup"],
    description: "Open the welcome system control panel.",

    async execute(client, message) {

        if (!message.guild) {
            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        if (
            !message.member.permissions.has("ManageGuild")
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission to configure the welcome system.`
            });
        }

        const config = getConfig(message.guild.id);

        const embed = new EmbedBuilder()
            .setColor(
                config.enabled
                    ? 0x57F287
                    : 0xED4245
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setDescription(
                `${config.enabled ? "🟢" : "🔴"} **Welcome System:** ${config.enabled ? "Enabled" : "Disabled"}\n\n` +
                `Configure your server's welcome system using the buttons below.`
            )
            .addFields(
                {
                    name: "Welcome Channel",
                    value:
                        config.channelId
                            ? `<#${config.channelId}>`
                            : "`Not configured`",
                    inline: true
                },
                {
                    name: "DM Welcome",
                    value:
                        config.dmEnabled
                            ? "🟢 Enabled"
                            : "🔴 Disabled",
                    inline: true
                }
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

        const row1 =
            new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId("welcome_enable")
                    .setLabel("Enable")
                    .setEmoji("🟢")
                    .setStyle(
                        config.enabled
                            ? ButtonStyle.Success
                            : ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId("welcome_disable")
                    .setLabel("Disable")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("welcome_edit_embed")
                    .setLabel("Edit Embed")
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("welcome_edit_text")
                    .setLabel("Edit Text")
                    .setEmoji("💬")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("welcome_edit_dm")
                    .setLabel("Edit DM")
                    .setEmoji("✉️")
                    .setStyle(ButtonStyle.Secondary)
            );

        const row2 =
            new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId("welcome_channel")
                    .setLabel("Channel")
                    .setEmoji("📢")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("welcome_variables")
                    .setLabel("Variables")
                    .setEmoji("🔤")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("welcome_test")
                    .setLabel("Test")
                    .setEmoji("🧪")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("welcome_help")
                    .setLabel("Help")
                    .setEmoji("❓")
                    .setStyle(ButtonStyle.Secondary)
            );

        return message.reply({
            embeds: [embed],
            components: [row1, row2]
        });
    }
};