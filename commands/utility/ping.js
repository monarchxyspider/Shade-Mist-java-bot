const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Display bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Ping`,
                iconURL: client.user.displayAvatarURL()
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`
${client.config.emojis.stats} __**Bot Statistics**__

${client.config.emojis.time} __**WebSocket**__
\`${client.ws.ping}ms\`

${client.config.emojis.gear} **Bot Status**
 <:upgrade:1494364520850784348> Online

${client.config.emojis.member} __**Guilds**__
 \`${client.guilds.cache.size}\`

${client.config.emojis.user} __**Users**__
 \`${client.users.cache.size}\`

${client.config.emojis.success} **Response**
_** Successfully Responded**_
`)
            .setFooter({
                text: `${client.config.botName} • Utility`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};