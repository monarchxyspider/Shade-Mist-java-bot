const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["<@1481550443149529270>"],
    description: "Display bot latency.",

    async execute(client, message) {

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Ping`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`
${client.config.emojis.stats} ## __**Bot Statistics**__
${client.config.emojis.time} __**WebSocket**__
> \`${client.ws.ping}ms\`
${client.config.emojis.gear} __**Bot Status**__
> <:upgrade:1494364520850784348>
${client.config.emojis.member}  __**Users**__
> \`${client.users.cache.size}\`
`)
            .setFooter({
                text: `${client.config.botName} • Utility`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Support Server")
                .setEmoji("<:list:1494365866916053022>")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/54vJcse3")
        );

        return message.reply({
            embeds: [embed],
            components: [row]
        });
    }
};