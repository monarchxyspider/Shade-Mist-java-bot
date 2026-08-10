const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "welcome",
    aliases: [],
    description: "Manage the server welcome system.",

    async execute(client, message, args) {

        // ==================================================
        // PERMISSION
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Manage Server** permission to use the welcome system.`
            });
        }

        // ==================================================
        // CONFIG MAP
        // ==================================================

        if (!client.welcomeConfigs) {
            client.welcomeConfigs = new Map();
        }

        let config =
            client.welcomeConfigs.get(
                message.guild.id
            );

        // ==================================================
        // DEFAULT CONFIG
        // ==================================================

        if (!config) {

            config = {
                enabled: false,
                channelId: null,

                message: "",

                embed: {
                    color: client.config.embedColor,
                    title: "",
                    description: "",
                    url: "",
                    author: {
                        name: "",
                        url: "",
                        iconURL: ""
                    },
                    thumbnail: "",
                    image: "",
                    footer: {
                        text: "",
                        iconURL: ""
                    },
                    timestamp: true
                },

                buttons: [],

                dmEnabled: false,
                dmMessage: ""
            };

            client.welcomeConfigs.set(
                message.guild.id,
                config
            );
        }

        // ==================================================
        // ENABLE / DISABLE
        // ==================================================

        const action =
            args[0]?.toLowerCase();

        if (action === "enable") {

            config.enabled = true;

            client.welcomeConfigs.set(
                message.guild.id,
                config
            );

            return sendPanel(
                client,
                message,
                config
            );
        }

        if (action === "disable") {

            config.enabled = false;

            client.welcomeConfigs.set(
                message.guild.id,
                config
            );

            return sendPanel(
                client,
                message,
                config
            );
        }

        // ==================================================
        // MAIN PANEL
        // ==================================================

        return sendPanel(
            client,
            message,
            config
        );
    }
};


// ==========================================================
// MAIN PANEL
// ==========================================================

async function sendPanel(
    client,
    message,
    config
) {

    const status =
        config.enabled
            ? "Enabled"
            : "Disabled";

    const statusEmoji =
        config.enabled
            ? client.config.emojis.success
            : client.config.emojis.error;

    const channel =
        config.channelId
            ? `<#${config.channelId}>`
            : "Not Set";

    const embed =
        new EmbedBuilder()
            .setColor(
                config.enabled
                    ? client.config.embedColor
                    : 0x2b2d31
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setDescription(
`
${statusEmoji} **Status:** ${status}
${client.config.emojis.channel} **Channel:** ${channel}

${client.config.emojis.message} **Welcome System**

Configure your server's welcome message, embed, DM message and welcome channel using the buttons below.
`
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome Configuration`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTimestamp();

    // ==================================================
    // ROW 1
    // ==================================================

    const row1 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        config.enabled
                            ? "welcome_disable"
                            : "welcome_enable"
                    )
                    .setLabel(
                        config.enabled
                            ? "Disable"
                            : "Enable"
                    )
                    .setEmoji(
                        config.enabled
                            ? client.config.emojis.error
                            : client.config.emojis.success
                    )
                    .setStyle(
                        config.enabled
                            ? ButtonStyle.Danger
                            : ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_embed"
                    )
                    .setLabel("Edit Embed")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_dm"
                    )
                    .setLabel("Edit DM")
                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );

    // ==================================================
    // ROW 2
    // ==================================================

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_test"
                    )
                    .setLabel("Test")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_channel"
                    )
                    .setLabel("Channel")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_variables"
                    )
                    .setLabel("Variables")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_help"
                    )
                    .setLabel("Help")
                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );

    // ==================================================
    // SEND
    // ==================================================

    return message.reply({
        embeds: [embed],
        components: [
            row1,
            row2
        ]
    });
}