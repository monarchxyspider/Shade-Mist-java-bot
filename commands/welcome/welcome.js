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
    description: "Welcome system commands.",

    async execute(client, message, args) {

        // ==========================================
        // SERVER ONLY
        // ==========================================

        if (!message.guild) {
            return message.reply({
                content: `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        const subcommand =
            args[0]?.toLowerCase();

        // ==========================================
        // s!welcome
        // ==========================================

        if (!subcommand) {
            return sendMainPanel(
                client,
                message
            );
        }

        // ==========================================
        // s!welcome config
        // ==========================================

        if (subcommand === "config") {
            return sendMainPanel(
                client,
                message
            );
        }

        // ==========================================
        // s!welcome enable
        // ==========================================

        if (subcommand === "enable") {

            return message.reply({
                content:
                    `${client.config.emojis.success} Welcome system enabled.`
            });

        }

        // ==========================================
        // s!welcome disable
        // ==========================================

        if (subcommand === "disable") {

            return message.reply({
                content:
                    `${client.config.emojis.success} Welcome system disabled.`
            });

        }

        // ==========================================
        // s!welcome test
        // ==========================================

        if (subcommand === "test") {

            return message.reply({
                content:
                    `${client.config.emojis.success} Welcome test message system is ready.`
            });

        }

        // ==========================================
        // s!welcome channel
        // ==========================================

        if (subcommand === "channel") {

            const channel =
                message.mentions.channels.first();

            if (!channel) {

                return message.reply({
                    content:
                        `${client.config.emojis.error} Please mention a channel.\n\nExample: \`s!welcome channel #welcome\``
                });

            }

            return message.reply({
                content:
                    `${client.config.emojis.success} Welcome channel set to ${channel}.`
            });

        }

        // ==========================================
        // s!welcome variables
        // ==========================================

        if (subcommand === "variables") {

            return sendVariables(
                client,
                message
            );

        }

        // ==========================================
        // s!welcome help
        // ==========================================

        if (subcommand === "help") {

            return sendHelp(
                client,
                message
            );

        }

        // ==========================================
        // UNKNOWN SUBCOMMAND
        // ==========================================

        return message.reply({
            content:
                `${client.config.emojis.error} Unknown welcome command.\nUse \`s!welcome help\` to see all commands.`
        });

    }
};


// ==================================================
// MAIN PANEL
// ==================================================

async function sendMainPanel(
    client,
    message
) {

    const embed =
        new EmbedBuilder()
            .setColor(
                client.config.embedColor
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTitle(
                "Welcome Configuration"
            )
            .setDescription(
                [
                    "Configure your server's welcome system from this panel.",
                    "",
                    `${client.config.emojis.message} **Status**`,
                    "> 🔴 Disabled",
                    "",
                    `${client.config.emojis.user} **Welcome Channel**`,
                    "> Not configured",
                    "",
                    `${client.config.emojis.moderator} **Welcome Message**`,
                    "> Not configured"
                ].join("\n")
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

    const row1 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_enable"
                    )
                    .setLabel(
                        "Enable"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_embed"
                    )
                    .setLabel(
                        "Edit Embed"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    )

            );

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_variables"
                    )
                    .setLabel(
                        "Variables"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_test"
                    )
                    .setLabel(
                        "Test Message"
                    )
                    .setStyle(
                        ButtonStyle.Success
                    )

            );

    return message.reply({
        embeds: [embed],
        components: [
            row1,
            row2
        ]
    });

}


// ==================================================
// VARIABLES
// ==================================================

async function sendVariables(
    client,
    message
) {

    const embed =
        new EmbedBuilder()
            .setColor(
                client.config.embedColor
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Variables`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTitle(
                "Welcome Variables"
            )
            .setDescription(
                [
                    "`{user.mention}`",
                    "Mentions the new member.",
                    "",
                    "`{user.id}`",
                    "User ID.",
                    "",
                    "`{user.avatar}`",
                    "User avatar URL.",
                    "",
                    "`{user.joinat}`",
                    "Member join date.",
                    "",
                    "`{timestamp}`",
                    "Current timestamp.",
                    "",
                    "`{guild.members}`",
                    "Total server members."
                ].join("\n")
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

    return message.reply({
        embeds: [embed]
    });

}


// ==================================================
// HELP
// ==================================================

async function sendHelp(
    client,
    message
) {

    const embed =
        new EmbedBuilder()
            .setColor(
                client.config.embedColor
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Help`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTitle(
                "Welcome Commands"
            )
            .setDescription(
                [
                    "`s!welcome`",
                    "Open the welcome configuration panel.",
                    "",
                    "`s!welcome config`",
                    "Open the welcome configuration panel.",
                    "",
                    "`s!welcome enable`",
                    "Enable the welcome system.",
                    "",
                    "`s!welcome disable`",
                    "Disable the welcome system.",
                    "",
                    "`s!welcome test`",
                    "Send a test welcome message.",
                    "",
                    "`s!welcome channel #channel`",
                    "Set the welcome channel.",
                    "",
                    "`s!welcome variables`",
                    "Show available welcome variables.",
                    "",
                    "`s!welcome help`",
                    "Show this help menu."
                ].join("\n")
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

    return message.reply({
        embeds: [embed]
    });

}