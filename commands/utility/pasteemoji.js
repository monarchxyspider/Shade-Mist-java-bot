const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "pasteemojis",
    aliases: ["pasteemoji"],
    description: "Paste emojis from another server.",

    async execute(client, message, args) {

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

        const code = args[0];
        const sourceGuildId = args[1];

        if (!code || !sourceGuildId) {
            return message.reply({
                content: `${client.config.emojis.error} Please provide the transfer code and source server ID.\nExample: \`s!pasteemojis SM-X7K4QP 123456789012345678\``
            });
        }

        if (!client.emojiTransfers) {
            return message.reply({
                content: `${client.config.emojis.error} This emoji transfer code doesn't exist or has expired.`
            });
        }

        const transfer = client.emojiTransfers.get(code.toUpperCase());

        if (!transfer) {
            return message.reply({
                content: `${client.config.emojis.error} **Invalid or expired transfer code.**`
            });
        }

        if (transfer.sourceGuildId !== sourceGuildId) {
            return message.reply({
                content: `${client.config.emojis.error} The source server ID doesn't match this transfer code.`
            });
        }

        const sourceGuild = client.guilds.cache.get(sourceGuildId);

        if (!sourceGuild) {
            return message.reply({
                content: `${client.config.emojis.error} I am not in the source server.`
            });
        }

        if (Date.now() - transfer.createdAt > 30 * 60 * 1000) {
            client.emojiTransfers.delete(code.toUpperCase());

            return message.reply({
                content: `${client.config.emojis.error} **This transfer code has expired.**`
            });
        }

        let added = 0;
        let skipped = 0;
        let failed = 0;

        const existingNames = new Set(
            message.guild.emojis.cache.map(emoji => emoji.name)
        );

        const processing = await message.reply({
            content: `${client.config.emojis.time} Copying **${transfer.emojis.length}** emojis from **${transfer.sourceGuildName}**...`
        });

        for (const emoji of transfer.emojis) {

            if (!emoji.name || !emoji.url) {
                failed++;
                continue;
            }

            if (existingNames.has(emoji.name)) {
                skipped++;
                continue;
            }

            try {

                await message.guild.emojis.create({
                    attachment: emoji.url,
                    name: emoji.name,
                    reason: `Emoji transfer from ${transfer.sourceGuildName}`
                });

                added++;
                existingNames.add(emoji.name);

            } catch (error) {

                console.error(
                    `Failed to create emoji ${emoji.name}:`,
                    error
                );

                failed++;
            }
        }

        client.emojiTransfers.delete(code.toUpperCase());

        const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Emoji Transfer`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`
${client.config.emojis.success} **Emoji Transfer Complete**
${client.config.emojis.server} **Source:** ${transfer.sourceGuildName}
${client.config.emojis.message} **Added:** ${added}
${client.config.emojis.info} **Skipped:** ${skipped}
${client.config.emojis.error} **Failed:** ${failed}
`)
            .setFooter({
                text: `${client.config.botName} • Transfer completed`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        return processing.edit({
            content: "",
            embeds: [embed]
        });

    }
};