const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "role",
    aliases: ["giverole"],
    description: "Add or remove a role.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Manage Roles** permission.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply({
                content: `${client.config.emojis.error} I need the **Manage Roles** permission.`
            });
        }

        const action = args[0]?.toLowerCase();

        if (!["add", "remove"].includes(action)) {
            return message.reply({
                content: `${client.config.emojis.error} Usage: \`s!role add/remove @role @user\``
            });
        }

        const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);

        if (!role) {
            return message.reply({
                content: `${client.config.emojis.error} Please provide a valid role.`
            });
        }

        if (role.id === message.guild.id) {
            return message.reply({
                content: `${client.config.emojis.error} You can't manage the **@everyone** role.`
            });
        }

        const member =
            message.mentions.members.first() ||
            await message.guild.members.fetch(args[2]).catch(() => null);

        if (!member) {
            return message.reply({
                content: `${client.config.emojis.error} Please provide a valid member.`
            });
        }

        if (member.roles.highest.position >= message.member.roles.highest.position &&
            message.author.id !== message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} This member has an equal or higher role than you.`
            });
        }

        if (role.position >= message.member.roles.highest.position &&
            message.author.id !== message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You can't manage this role.`
            });
        }

        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} My role is lower than the selected role.`
            });
        }

        const reasonIndex = args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";
        try {

            if (action === "add") {

                if (member.roles.cache.has(role.id)) {
                    return message.reply({
                        content: `${client.config.emojis.error} This member already has that role.`
                    });
                }

                await member.roles.add(
                    role,
                    `${reason} | By ${message.author.tag}`
                );

            } else {

                if (!member.roles.cache.has(role.id)) {
                    return message.reply({
                        content: `${client.config.emojis.error} This member doesn't have that role.`
                    });
                }

                await member.roles.remove(
                    role,
                    `${reason} | By ${message.author.tag}`
                );

            }

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Role ${action === "add" ? "Added" : "Removed"}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.success} **Role ${action === "add" ? "Added" : "Removed"} Successfully**
${client.config.emojis.user} **User:** ${member.user.tag}
${client.config.emojis.role} **Role:** ${role}
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
                content: `${client.config.emojis.error} Failed to ${action} the role.`
            });

        }

    }

};