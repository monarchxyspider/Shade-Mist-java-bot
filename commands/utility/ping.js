const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Shows the bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Bot Statistics`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(
`${client.config.emojis.stats} **Bot Statistics**

${client.config.emojis.time} **WebSocket Ping**
> \`${client.ws.ping}ms\`

${client.config.emojis.gear} **Bot Status**
> Online

${client.config.emojis.success} **Response**
> Successfully Responded`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: client.config.botName
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/54vJcse3"),

            new ButtonBuilder()
                .setLabel("Ping")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji("🏓")
        );

        return message.reply({
            embeds: [embed],
            components: [row]
        });

    }
};