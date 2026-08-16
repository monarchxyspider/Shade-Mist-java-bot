const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    name: "electricty",
    aliases: [khatta],
    description: "Developer-only electricity panel.",

    async execute(client, message, args) {
 ==========================================
        // EMBED
        // ==========================================

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)

            .setAuthor({
                name: `${client.config.botName} • Electricity`,
                iconURL: client.user.displayAvatarURL()
            })

            .setTitle("⚡ Electricity")

            .setDescription(
                [
                    "Here are the available project links.",
                    "",
                    `${client.config.emojis.message} **Replit Project**`,
                    "> Open the live Replit website.",
                    "",
                    `${client.config.emojis.gear} **GitHub Project**`,
                    "> Open the GitHub Pages website."
                ].join("\n")
            )

            .setFooter({
                text: `${client.config.botName} • Developer Panel`,
                iconURL: client.user.displayAvatarURL()
            })

            .setTimestamp();

        // ==========================================
        // BUTTONS
        // ==========================================

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setLabel("Replit")
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        "https://hello-how--monarchdark67.replit.app"
                    ),

                new ButtonBuilder()
                    .setLabel("GitHub")
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        "https://monarchxyspider.github.io/papa-jersey/"
                    )

            );

        // ==========================================
        // SEND
        // ==========================================

        return message.reply({
            embeds: [embed],
            components: [row]
        });

    }
};