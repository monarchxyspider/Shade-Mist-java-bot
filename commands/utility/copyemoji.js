const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "copyemojis",
    aliases: ["copyemoji"],
    description: "Create a transfer code for this server's emojis.",

    async execute(client, message) {

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Administrator** permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
            return message.reply({
                content: `${client.config.emojis.error} I need the **Manage Emojis and Stickers** permission.`
            });
        }

        const emojis = message.guild.emojis.cache;

        if (!emojis.size) {
            return message.reply({
                content: `${client.config.emojis.error} This server doesn't have any emojis to copy.`
            });
        }

        if (!client.emojiTransfers) {
            client.emojiTransfers = new Map();
        }

        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "SM-";

        for (let i = 0; i < 6; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        client.emojiTransfers.set(code, {
            sourceGuildId: message.guild.id,
            sourceGuildName: message.guild.name,
            emojis: emojis.map(emoji => ({
                id: emoji.id,
                name: emoji.name,
                url: emoji.imageURL(),
                animated: emoji.animated
            })),
            createdBy: message.author.id,
            createdAt: Date.now()
        });

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Emoji Transfer`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`
${client.config.emojis.success} **Emoji Transfer Code Created**
${client.config.emojis.server} **Server:** ${message.guild.name}
${client.config.emojis.message} **Emojis:** ${emojis.size}
${client.config.emojis.time} **Code:** \`${code}\`
${client.config.emojis.info} **Source ID:** \`${message.guild.id}\`
`)
            .setFooter({
                text: `${client.config.botName} • Use this code with s!pasteemojis`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
};