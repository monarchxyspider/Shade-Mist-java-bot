const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "snipe",
    aliases: ["s"],
    description: "View the last deleted message.",

    async execute(client, message) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Manage Messages** permission.`
            });
        }

        const data = client.snipes?.get(message.channel.id);

        if (!data) {
            return message.reply({
                content: `${client.config.emojis.error} There are no recently deleted messages in this channel.`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Sniped Message`,
                iconURL: data.author.displayAvatarURL()
            })
            .setThumbnail(data.author.displayAvatarURL())
            .addFields(
                {
                    name: "Author",
                    value: `${data.author.tag} (\`${data.author.id}\`)`
                },
                {
                    name: "Message",
                    value: data.content.length
                        ? data.content
                        : "*No message content.*"
                },
                {
                    name: "Deleted",
                    value: `<t:${Math.floor(data.deletedTimestamp / 1000)}:R>`
                }
            )
            .setFooter({
                text: client.config.botName,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        if (data.attachments.length) {
            embed.addFields({
                name: "Attachment",
                value: data.attachments[0].url
            });

            if (data.attachments[0].contentType?.startsWith("image")) {
                embed.setImage(data.attachments[0].url);
            }
        }

        if (data.stickers.length) {
            embed.addFields({
                name: "Sticker",
                value: data.stickers[0].name
            });
        }

        return message.reply({
            embeds: [embed]
        });

    }
};