const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "unlock",
    aliases: ["unlockdown"],
    description: "Unlock the current channel.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Manage Channels** permission.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply({
                content: `${client.config.emojis.error} I need the **Manage Channels** permission.`
            });
        }

        if (!message.channel.manageable) {
            return message.reply({
                content: `${client.config.emojis.error} I can't edit this channel's permissions.`
            });
        }

        const everyone = message.guild.roles.everyone;

        const perms = message.channel.permissionsFor(everyone);

        if (
            perms.has(PermissionFlagsBits.SendMessages) &&
            perms.has(PermissionFlagsBits.AddReactions)
        ) {
            return message.reply({
                content: `${client.config.emojis.error} This channel is already unlocked.`
            });
        }

        const reasonIndex = args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        try {

            await message.channel.permissionOverwrites.edit(everyone, {
                SendMessages: null,
                AddReactions: null,
                CreatePublicThreads: null,
                CreatePrivateThreads: null,
                SendMessagesInThreads: null
            });

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Channel Unlocked`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.success} **Channel Unlocked Successfully**
${client.config.emojis.channel} **Channel:** ${message.channel}
${client.config.emojis.moderator} **Moderator:** ${message.author.tag}
${client.config.emojis.message} **Reason:** ${reason}
`)
                .setFooter({
                    text: client.config.botName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (err) {

            console.error(err);

            return message.reply({
                content: `${client.config.emojis.error} Failed to unlock this channel.`
            });

        }

    }
};