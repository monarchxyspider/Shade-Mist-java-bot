const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["b"],
    description: "Ban a member.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} You need **Ban Members** permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have **Ban Members** permission.`
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
                content: `${client.config.emojis.error} You can't ban yourself.`
            });
        }

        if (member.id === client.user.id) {
            return message.reply({
                content: `${client.config.emojis.error} I can't ban myself.`
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You can't ban the server owner.`
            });
        }

        if (
            member.roles.highest.position >=
            message.member.roles.highest.position
        ) {
            return message.reply({
                content: `${client.config.emojis.error} This member has an equal or higher role than you.`
            });
        }

        if (
            member.roles.highest.position >=
            message.guild.members.me.roles.highest.position
        ) {
            return message.reply({
                content: `${client.config.emojis.error} My role is lower than that member's role.`
            });
        }

        const reasonIndex = args.findIndex(arg => arg.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        // Part 2 continues here...
        try {

            const dmEmbed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Ban Notice`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.sword} **You have been banned**

${client.config.emojis.place} **Server**
>>> ${message.guild.name}

${client.config.emojis.moderator} **Moderator**
>>> ${message.author.tag}

${client.config.emojis.message} **Reason**
>>> ${reason}
`)
                .setTimestamp();

            await member.send({
                embeds: [dmEmbed]
            }).catch(() => {});

            await member.ban({
                reason: `${reason} | By ${message.author.tag}`
            });

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Ban`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`
${client.config.emojis.success} **Member Banned Successfully**

${client.config.emojis.user} **User**
>>> ${member.user.tag} (\`${member.id}\`)

${client.config.emojis.moderator} **Moderator**
>>> ${message.author}

${client.config.emojis.message} **Reason**
>>> ${reason}
`)
                .setFooter({
                    text: client.config.botName
                })
                .setTimestamp