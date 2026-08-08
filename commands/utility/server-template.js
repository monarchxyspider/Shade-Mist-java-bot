const {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");
const crypto = require("crypto");

module.exports = {
    name: "server-template",
    aliases: ["servertemplate"],
    description: "Create a custom server backup template.",

    async execute(client, message) {

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
        // USER PERMISSION
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Administrator** permission to create a server template.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        const botMember = guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Administrator** permission to create a server template.`
            });
        }

        // ==================================================
        // INITIALIZE TEMPLATE STORAGE
        // ==================================================

        if (!client.templates) {
            client.templates = new Map();
        }

        try {

            // ==================================================
            // GENERATE TEMPLATE CODE
            // ==================================================

            const code = crypto
                .randomBytes(6)
                .toString("hex")
                .toUpperCase();

            // ==================================================
            // COLLECT ROLES
            // ==================================================

            const roles = guild.roles.cache
                .filter(role => !role.managed)
                .sort((a, b) => a.position - b.position)
                .map(role => ({
                    id: role.id,
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    permissions: role.permissions.bitfield.toString(),
                    position: role.position
                }));

            // ==================================================
            // COLLECT CHANNELS
            // ==================================================

            const channels = guild.channels.cache
                .sort((a, b) => a.rawPosition - b.rawPosition)
                .map(channel => ({

                    id: channel.id,

                    name: channel.name,

                    type: channel.type,

                    position: channel.rawPosition,

                    parentId: channel.parentId || null,

                    topic:
                        "topic" in channel
                            ? channel.topic
                            : null,

                    nsfw:
                        "nsfw" in channel
                            ? channel.nsfw
                            : false,

                    rateLimitPerUser:
                        "rateLimitPerUser" in channel
                            ? channel.rateLimitPerUser
                            : 0,

                    bitrate:
                        "bitrate" in channel
                            ? channel.bitrate
                            : null,

                    userLimit:
                        "userLimit" in channel
                            ? channel.userLimit
                            : 0,

                    permissionOverwrites:
                        channel.permissionOverwrites.cache.map(
                            overwrite => ({
                                id: overwrite.id,

                                type: overwrite.type,

                                allow:
                                    overwrite.allow.bitfield.toString(),

                                deny:
                                    overwrite.deny.bitfield.toString()
                            })
                        )
                }));

            // ==================================================
            // SERVER DATA
            // ==================================================

            const template = {

                name:
                    `${guild.name} Template`,

                sourceGuild:
                    guild.id,

                sourceGuildName:
                    guild.name,

                createdBy:
                    message.author.id,

                createdAt:
                    Date.now(),

                everyoneRoleId:
                    guild.id,

                roles,

                channels
            };

            // ==================================================
            // SAVE TEMPLATE
            // ==================================================

            client.templates.set(
                code,
                template
            );

            // ==================================================
            // SUCCESS EMBED
            // ==================================================

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)

                .setAuthor({
                    name:
                        `${client.config.botName} • Server Template`,
                    iconURL:
                        client.user.displayAvatarURL()
                })

                .setDescription(
                    `${client.config.emojis.success} **Server Template Created**\n\n` +

                    `${client.config.emojis.server} **Server**\n` +
                    `> ${guild.name}\n\n` +

                    `${client.config.emojis.message} **Template Code**\n` +
                    `> \`${code}\`\n\n` +

                    `${client.config.emojis.role || "🎭"} **Roles**\n` +
                    `> ${roles.length}\n\n` +

                    `${client.config.emojis.channel || "📁"} **Channels**\n` +
                    `> ${channels.length}\n\n` +

                    `${client.config.emojis.info} **Restore**\n` +
                    `> \`s!template ${code}\``
                )

                .setFooter({
                    text:
                        `${client.config.botName} • Custom Template`,
                    iconURL:
                        client.user.displayAvatarURL()
                })

                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (error) {

            // ==================================================
            // ERROR
            // ==================================================

            console.error(
                "Server Template Error:",
                error
            );

            return message.reply({
                content:
                    `${client.config.emojis.error} **Failed to create the server template.**\n\n` +
                    `\`\`\`${error.message || "Unknown error"}\`\`\``
            });
        }
    }
};