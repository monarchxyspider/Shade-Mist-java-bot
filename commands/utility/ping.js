const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Shows bot ping.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Utility`
            })
            .setDescription(`
${client.config.emojis.stats} **Bot Statistics**

${client.config.emojis.time} **Ping**
> \`${client.ws.ping}ms\`

${client.config.emojis.success} Pong!
`)
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};