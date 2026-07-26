const { EmbedBuilder } = require("discord.js");

module.exports = {

    name: "ping",
    aliases: ["p"],
    description: "Shows bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Utility`
            })
            .setDescription(
`${client.config.emojis.stats} **Bot Statistics**

${client.config.emojis.time} **Latency**
> \`${client.ws.ping}ms\`

${client.config.emojis.gear} **Status**
> Online

<:green_tick:1530887008581587095> **Request Completed Successfully**`
            );

        message.reply({
            embeds: [embed]
        });

    }

};