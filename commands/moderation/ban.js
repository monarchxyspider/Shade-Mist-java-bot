const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["b"],
    description: "Ban a member from the server.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Ban Members** permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have the **Ban Members** permission.`
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
                content: `${client.config.emojis.error} You cannot ban yourself.`
            });
        }

        if (member.id === client.user.id) {
            return message.reply({
                content: `${client.config.emojis.error} I cannot ban myself.`
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot ban the server owner.`
            });
        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} This member has an equal or higher role than you.`
            });
        }

        if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} My highest role is lower than this member's role.`
            });
        }

        const reasonIndex = args.findIndex(arg => arg.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        try {            const dmEmbed = new EmbedBuilder()
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
                content: `${client.config.emojis.error} Failed to ban that member.`
            });

        }

    }

};
