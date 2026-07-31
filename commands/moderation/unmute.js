const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "untimeout",
    aliases: ["unto", "unmute"],
    description: "Remove timeout from a member.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} You don't have permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have the **Moderate Members** permission.`
            });
        }

        const member =
            message.mentions.members.first() ||
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!member) {
            return message.reply({
                content: `${client.config.emojis.error} Please mention a valid member.`
            });
        }

        if (member.id === message.author.id) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot remove your own timeout.`
            });
        }

        if (member.id === client.user.id) {
            return message.reply({
                content: `${client.config.emojis.error} I cannot remove my own timeout.`
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot remove the owner's timeout.`
            });
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} This member has an equal or higher role than you.`
            });
        }

        if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} My role is lower than this member's role.`
            });
        }

        if (!member.communicationDisabledUntil || member.communicationDisabledUntil.getTime() <= Date.now()) {
            return message.reply({
                content: `${client.config.emojis.error} This member is not currently timed out.`
            });
        }

        const reasonIndex = args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        // ===== Part 2 Starts Here =====
try {

    await member.timeout(
        null,
        `${reason} | By ${message.author.tag}`
    );

    const success = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setAuthor({
            name: `${client.config.botName} • Timeout Removed`,
            iconURL: client.user.displayAvatarURL()
        })
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`
${client.config.emojis.success} **Action Executed Successfully**
${client.config.emojis.user} **User**
${member.user.tag} (\`${member.id}\`)
${client.config.emojis.moderator} **Moderator**
${message.author.tag}
${client.config.emojis.message} **Reason**
${reason}
`)
        .setFooter({
            text: client.config.botName,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    return message.reply({
        embeds: [success]
    });

} catch (err) {

    console.error(err);

    return message.reply({
        content: `${client.config.emojis.error} Failed to remove the timeout from this member.`
    });

}

    }

};