const {
    EmbedBuilder,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getConfig,
    setChannel
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-channel",
    aliases: ["welcomechannel"],
    description: "Set the welcome message channel.",

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
                    `${client.config.emojis.error} You need **Manage Server** permission to configure the welcome channel.`
            });
        }

        const config =
            getConfig(message.guild.id);

        // ==================================================
        // CURRENT CHANNEL
        // ==================================================

        const currentChannel =
            config.channelId
                ? message.guild.channels.cache.get(
                    config.channelId
                )
                : null;

        const embed =
            new EmbedBuilder()
                .setColor(
                    client.config.embedColor
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Welcome Channel`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
                    `${client.config.emojis.info || "ℹ️"} **Welcome Channel Configuration**\n\n` +
                    `**Current Channel:** ${
                        currentChannel
                            ? `<#${currentChannel.id}>`
                            : "`Not configured`"
                    }\n\n` +
                    `Select the channel below where the bot should send welcome messages.`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome System`
                })
                .setTimestamp();

        // ==================================================
        // CHANNEL SELECT
        // ==================================================

        const select =
            new ChannelSelectMenuBuilder()
                .setCustomId(
                    "welcome_channel_select"
                )
                .setPlaceholder(
                    "Select a welcome channel..."
                )
                .setChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setMinValues(1)
                .setMaxValues(1);

        const selectRow =
            new ActionRowBuilder()
                .addComponents(select);

        // ==================================================
        // RETURN BUTTON
        // ==================================================

        const buttonRow =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_return"
                        )
                        .setLabel("Return")
                        .setEmoji("↩️")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        return message.reply({
            embeds: [embed],
            components: [
                selectRow,
                buttonRow
            ]
        });
    }
};