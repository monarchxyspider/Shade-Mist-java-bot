const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Shows the bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle("🏓 Pong!")
            .setDescription(
`**WebSocket Ping**
> \`${client.ws.ping}ms\`

**Status**
> Online`
            )
            .setFooter({
                text: client.config.botName
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};