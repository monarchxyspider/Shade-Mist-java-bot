const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["k"],
    description: "Kick a member.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} You don't have permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have the **Kick Members** permission.`
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

        if (!member.kickable) {
            return message.reply({
                content: `${client.config.emojis.error} I cannot kick this member.`
            });
        }

        if (member.id === message.author.id) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot kick yourself.`
            });
        }

        if (member.id === client.user.id) {
            return message.reply({
                content: `${client.config.emojis.error} I cannot kick myself.`
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot kick the server owner.`
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

        const reasonIndex = args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Kick Notice`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.sword} _**You have been kicked**_

<:Book:1487485966544277514>_**Server**_
> ${message.guild.name}

${client.config.emojis.moderator__**Moderator**__
> ${message.author.tag}

${client.config.emojis.message} **Reason**
> ${reason}
`)
                .setFooter({
                    text: client.config.botName
                })
                .setTimestamp();

            await member.send({
                embeds: [dmEmbed]
            }).catch(() => {});

            await member.kick(
                `${reason} | By ${message.author.tag}`
            );

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Member Kicked`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`
 _**Action Executed Successfully**_ ${client.config.emojis.success}

${client.config.emojis.user} **User**
> ${member.user.tag} (\`${member.id}\`)

${client.config.emojis.moderator} **Moderator**
> ${message.author}

${client.config.emojis.message} **Reason**
> ${reason}
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
                content: `${client.config.emojis.error} Failed to kick this member.`
            });

        }

    }

};