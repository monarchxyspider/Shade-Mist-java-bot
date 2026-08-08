const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "channelfont",
    aliases: ["channel-font", "cf"],
    description: "Convert all channel names to normal font.",

    async execute(client, message, args) {

        // ==================================================
        // SERVER CHECK
        // ==================================================

        if (!message.guild) {
            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        const guild = message.guild;

        // ==================================================
        // ARGUMENT CHECK
        // ==================================================

        const style = args[0]?.toLowerCase();

        if (!style || style !== "normal") {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please use:\n` +
                    `\`s!channelfont normal\``
            });
        }

        // ==================================================
        // USER PERMISSION
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Channels** permission to use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        const botMember = guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Manage Channels** permission to rename channels.`
            });
        }

        // ==================================================
        // START MESSAGE
        // ==================================================

        const status = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Channel Font`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Converting channel names to normal font...**`
                    )
                    .setTimestamp()
            ]
        });

        // ==================================================
        // CHANNELS
        // ==================================================

        const channels = [
            ...guild.channels.cache.values()
        ];

        let changed = 0;
        let skipped = 0;

        // ==================================================
        // CONVERT EACH CHANNEL
        // ==================================================

        for (const channel of channels) {

            try {

                // Skip channels the bot cannot edit
                if (!channel.manageable) {
                    skipped++;
                    continue;
                }

                const oldName = channel.name;

                // Unicode compatibility normalization
                const normalName =
                    oldName.normalize("NFKC");

                // Nothing to change
                if (oldName === normalName) {
                    skipped++;
                    continue;
                }

                await channel.setName(
                    normalName,
                    "Convert channel name to normal font"
                );

                changed++;

            } catch (error) {

                skipped++;

                console.log(
                    `Could not rename channel ${channel.name}:`,
                    error.message
                );
            }
        }

        // ==================================================
        // SUCCESS
        // ==================================================

        return status.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Channel Font`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success} **Channel fonts converted successfully!**\n\n` +

                        `${client.config.emojis.channel || "📁"} **Channels Changed**\n` +
                        `> ${changed}\n\n` +

                        `${client.config.emojis.info} **Skipped**\n` +
                        `> ${skipped}\n\n` +

                        `${client.config.emojis.success} All supported fancy Unicode fonts were converted to their normal Unicode form.`
                    )
                    .setFooter({
                        text:
                            `${client.config.botName} • Channel Font`
                    })
                    .setTimestamp()
            ]
        });
    }
};