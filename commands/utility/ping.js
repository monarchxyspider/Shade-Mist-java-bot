const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Check bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Ping`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription([
                `${client.config.emojis.stats} **Bot Statistics**`,
                "",
                `${client.config.emojis.time} **WebSocket Ping**`,
                `> \`${client.ws.ping}ms\``,
                "",
                `${client.config.emojis.success} **Status**`,
                `> Online`
            ].join("\n"))
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};