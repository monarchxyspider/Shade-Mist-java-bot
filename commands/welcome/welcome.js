const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "welcome",
    aliases: [],
    description: "Configure the welcome system.",

    async execute(client, message, args) {

        // ==========================================
        // ONLY SERVER
        // ==========================================

        if (!message.guild) {
            return message.reply({
                content: `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        // ==========================================
        // MAIN WELCOME PANEL
        // ==========================================

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Welcome System`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle("Welcome Configuration")
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
                text: `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

        // ==========================================
        // ENABLE / EDIT EMBED
        // ==========================================

        const row1 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("welcome_enable")
                    .setLabel("Enable")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("welcome_edit_embed")
                    .setLabel("Edit Embed")
                    .setStyle(ButtonStyle.Secondary)

            );

        // ==========================================
        // VARIABLES / TEST
        // ==========================================

        const row2 = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("welcome_variables")
                    .setLabel("Variables")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("welcome_test")
                    .setLabel("Test Message")
                    .setStyle(ButtonStyle.Success)

            );

        // ==========================================
        // SEND PANEL
        // ==========================================

        return message.reply({
            embeds: [embed],
            components: [
                row1,
                row2
            ]
        });

    }
};