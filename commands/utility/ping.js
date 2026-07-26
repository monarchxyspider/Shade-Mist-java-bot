const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Shows bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Bot Statistics`,
                iconURL: client.user.displayAvatarURL()
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`
${client.config.emojis.stats} **Bot Statistics**

${client.config.emojis.time} **WebSocket Ping**
> \`${client.ws.ping}ms\`

${client.config.emojis.gear} **Bot Status**
> Online

${client.config.emojis.success} **Successfully Responded**
`)
            .setFooter({
                text: client.config.botName,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};