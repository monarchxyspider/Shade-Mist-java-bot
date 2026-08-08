const {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "template",
    aliases: ["restore-template"],
    description: "Restore a custom server template.",

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
        // TEMPLATE CODE
        // ==================================================

        const code = args[0]?.trim().toUpperCase();

        if (!code) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please provide a template code.\n\n` +
                    `Example: \`s!template ABC123456789\``
            });
        }

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
                    `${client.config.emojis.error} You need **Administrator** permission to restore a server template.`
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
                    `${client.config.emojis.error} I need **Administrator** permission to restore a server template.`
            });
        }

        // ==================================================
        // TEMPLATE STORAGE
        // ==================================================

        if (!client.templates || !client.templates.has(code)) {
            return message.reply({
                content:
                    `${client.config.emojis.error} **Template not found.**\n\n` +
                    `Make sure the code is correct and the bot has not been restarted since the template was created.`
            });
        }

        const template = client.templates.get(code);

        // ==================================================
        // CONFIRMATION
        // ==================================================

        const warning = new EmbedBuilder()
            .setColor(0xED4245)

            .setAuthor({
                name:
                    `${client.config.botName} • Template Restore`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setDescription(
                `${client.config.emojis.warning || "⚠️"} **Server Template Restore**\n\n` +

                `You are about to restore:\n` +
                `> **${template.name}**\n\n` +

                `${client.config.emojis.server} **Source Server**\n` +
                `> ${template.sourceGuildName}\n\n` +

                `${client.config.emojis.role || "🎭"} **Roles**\n` +
                `> ${template.roles.length}\n\n` +

                `${client.config.emojis.channel || "📁"} **Channels**\n` +
                `> ${template.channels.length}\n\n` +

                `${client.config.emojis.error} **Warning**\n` +
                `> Existing channels and custom roles in this server will be removed.\n\n` +

                `React with ✅ within **20 seconds** to continue.`
            )

            .setFooter({
                text:
                    `${client.config.botName} • This action cannot be easily undone`
            })

            .setTimestamp();

        const warningMessage = await message.reply({
            embeds: [warning]
        });

        await warningMessage.react("✅");

        // ==================================================
        // CONFIRMATION FILTER
        // ==================================================

        const filter = (reaction, user) =>
            reaction.emoji.name === "✅" &&
            user.id === message.author.id;

        try {

            await warningMessage.awaitReactions({
                filter,
                max: 1,
                time: 20000,
                errors: ["time"]
            });

        } catch {

            return warningMessage.edit({
                content:
                    `${client.config.emojis.error} **Template restore cancelled.**`,
                embeds: []
            });
        }

        // ==================================================
        // RESTORE STATUS
        // ==================================================

        const status = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Restoring Template`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Starting template restore...**`
                    )
                    .setTimestamp()
            ]
        });

        try {

            // ==================================================
            // ROLE MAP
            // ==================================================

            const roleMap = new Map();

            // Template @everyone → Current @everyone
            roleMap.set(
                template.everyoneRoleId,
                guild.roles.everyone.id
            );

            // ==================================================
            // DELETE EXISTING CHANNELS
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Removing existing channels...**`
            );

            const existingChannels = [
                ...guild.channels.cache.values()
            ];

            for (const channel of existingChannels) {

                try {

                    await channel.delete(
                        "Custom server template restore"
                    );

                } catch (error) {

                    console.log(
                        `Could not delete channel ${channel.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // DELETE EXISTING CUSTOM ROLES
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Removing existing roles...**`
            );

            const existingRoles = [
                ...guild.roles.cache.values()
            ]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .sort((a, b) => b.position - a.position);

            for (const role of existingRoles) {

                try {

                    await role.delete(
                        "Custom server template restore"
                    );

                } catch (error) {

                    console.log(
                        `Could not delete role ${role.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // CREATE ROLES
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Creating roles...**`
            );

            const templateRoles = [...template.roles]
                .filter(role =>
                    role.id !== template.everyoneRoleId
                )
                .sort((a, b) =>
                    a.position - b.position
                );

            for (const roleData of templateRoles) {

                try {

                    const newRole =
                        await guild.roles.create({

                            name:
                                roleData.name || "Role",

                            color:
                                roleData.color || 0,

                            hoist:
                                roleData.hoist || false,

                            mentionable:
                                roleData.mentionable || false,

                            permissions:
                                BigInt(
                                    roleData.permissions || "0"
                                ),

                            reason:
                                "Custom server template restore"
                        });

                    roleMap.set(
                        roleData.id,
                        newRole.id
                    );

                } catch (error) {

                    console.log(
                        `Could not create role ${roleData.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // RESTORE ROLE POSITIONS
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Restoring role positions...**`
            );

            const rolePositions = [];

            for (const roleData of templateRoles) {

                const newRoleId =
                    roleMap.get(roleData.id);

                if (!newRoleId) continue;

                rolePositions.push({
                    role: newRoleId,
                    position: roleData.position
                });
            }

            if (rolePositions.length) {

                try {

                    await guild.roles.setPositions({
                        positions: rolePositions
                    });

                } catch (error) {

                    console.log(
                        "Role position error:",
                        error.message
                    );
                }
            }

            // ==================================================
            // CHANNEL MAP
            // ==================================================

            const channelMap = new Map();

            // ==================================================
            // GET CHANNELS
            // ==================================================

            const templateChannels =
                [...template.channels]
                    .sort(
                        (a, b) =>
                            a.position - b.position
                    );

            // ==================================================
            // CREATE CATEGORIES FIRST
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Creating categories...**`
            );

            const categories =
                templateChannels.filter(
                    channel =>
                        channel.type ===
                            ChannelType.GuildCategory
                );

            for (const category of categories) {

                try {

                    const permissionOverwrites =
                        buildPermissionOverwrites(
                            category.permissionOverwrites,
                            roleMap,
                            guild
                        );

                    const newCategory =
                        await guild.channels.create({

                            name:
                                category.name || "Category",

                            type:
                                ChannelType.GuildCategory,

                            permissionOverwrites,

                            reason:
                                "Custom server template restore"
                        });

                    channelMap.set(
                        category.id,
                        newCategory.id
                    );

                } catch (error) {

                    console.log(
                        `Could not create category ${category.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // CREATE NORMAL CHANNELS
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Creating channels...**`
            );

            const normalChannels =
                templateChannels.filter(
                    channel =>
                        channel.type !==
                        ChannelType.GuildCategory
                );

            for (const channelData of normalChannels) {

                try {

                    const options = {
                        name:
                            channelData.name || "channel",

                        type:
                            getSafeChannelType(
                                channelData.type
                            ),

                        reason:
                            "Custom server template restore"
                    };

                    // ==================================================
                    // CATEGORY
                    // ==================================================

                    if (channelData.parentId) {

                        const parentId =
                            channelMap.get(
                                channelData.parentId
                            );

                        if (parentId) {
                            options.parent = parentId;
                        }
                    }

                    // ==================================================
                    // PERMISSIONS
                    // ==================================================

                    const permissionOverwrites =
                        buildPermissionOverwrites(
                            channelData.permissionOverwrites,
                            roleMap,
                            guild
                        );

                    if (permissionOverwrites.length) {
                        options.permissionOverwrites =
                            permissionOverwrites;
                    }

                    // ==================================================
                    // TEXT CHANNEL SETTINGS
                    // ==================================================

                    if (
                        channelData.type ===
                            ChannelType.GuildText ||
                        channelData.type ===
                            ChannelType.GuildAnnouncement
                    ) {

                        if (channelData.topic) {
                            options.topic =
                                channelData.topic;
                        }

                        if (
                            typeof channelData.nsfw ===
                            "boolean"
                        ) {
                            options.nsfw =
                                channelData.nsfw;
                        }

                        if (
                            typeof channelData.rateLimitPerUser ===
                            "number"
                        ) {
                            options.rateLimitPerUser =
                                channelData.rateLimitPerUser;
                        }
                    }

                    // ==================================================
                    // VOICE CHANNEL SETTINGS
                    // ==================================================

                    if (
                        channelData.type ===
                            ChannelType.GuildVoice ||
                        channelData.type ===
                            ChannelType.GuildStageVoice
                    ) {

                        if (channelData.bitrate) {

                            options.bitrate =
                                Math.min(
                                    channelData.bitrate,
                                    guild.maximumBitrate
                                );
                        }

                        if (
                            typeof channelData.userLimit ===
                            "number"
                        ) {
                            options.userLimit =
                                channelData.userLimit;
                        }
                    }

                    // ==================================================
                    // CREATE CHANNEL
                    // ==================================================

                    const newChannel =
                        await guild.channels.create(
                            options
                        );

                    channelMap.set(
                        channelData.id,
                        newChannel.id
                    );

                } catch (error) {

                    console.log(
                        `Could not create channel ${channelData.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // FIX CHANNEL POSITIONS
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Restoring channel positions...**`
            );

            const channelPositions = [];

            for (const channelData of templateChannels) {

                const newChannelId =
                    channelMap.get(
                        channelData.id
                    );

                if (!newChannelId) continue;

                channelPositions.push({
                    channel:
                        newChannelId,

                    position:
                        channelData.position
                });
            }

            if (channelPositions.length) {

                try {

                    await guild.channels.setPositions({
                        positions:
                            channelPositions
                    });

                } catch (error) {

                    console.log(
                        "Channel position error:",
                        error.message
                    );
                }
            }

            // ==================================================
            // SUCCESS
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            client.config.embedColor
                        )

                        .setAuthor({
                            name:
                                `${client.config.botName} • Template Restored`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })

                        .setDescription(
                            `${client.config.emojis.success} **Template Successfully Restored!**\n\n` +

                            `${client.config.emojis.server} **Source Server**\n` +
                            `> ${template.sourceGuildName}\n\n` +

                            `${client.config.emojis.role || "🎭"} **Roles Created**\n` +
                            `> ${roleMap.size - 1}\n\n` +

                            `${client.config.emojis.channel || "📁"} **Channels Created**\n` +
                            `> ${channelMap.size}\n\n` +

                            `${client.config.emojis.success} The server structure has been restored successfully.`
                        )

                        .setFooter({
                            text:
                                `${client.config.botName} • Template ${code}`
                        })

                        .setTimestamp()
                ]
            });

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "TEMPLATE RESTORE ERROR"
            );

            console.error(
                error
            );

            console.error(
                "========================================"
            );

            return status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)

                        .setAuthor({
                            name:
                                `${client.config.botName} • Restore Failed`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })

                        .setDescription(
                            `${client.config.emojis.error} **Template restore failed.**\n\n` +
                            `**Reason:**\n` +
                            `> ${error.message || "Unknown error"}`
                        )

                        .setFooter({
                            text:
                                `${client.config.botName} • Error`
                        })

                        .setTimestamp()
                ]
            });
        }
    }
};


// ==========================================================
// UPDATE STATUS
// ==========================================================

async function updateStatus(
    message,
    client,
    text
) {

    return message.edit({
        embeds: [
            new EmbedBuilder()
                .setColor(
                    client.config.embedColor
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Template Restore`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(text)
                .setTimestamp()
        ]
    });
}


// ==========================================================
// CHANNEL TYPE
// ==========================================================

function getSafeChannelType(type) {

    const allowed = [

        ChannelType.GuildText,

        ChannelType.GuildVoice,

        ChannelType.GuildAnnouncement,

        ChannelType.GuildStageVoice,

        ChannelType.GuildForum,

        ChannelType.GuildMedia
    ];

    if (allowed.includes(type)) {
        return type;
    }

    return ChannelType.GuildText;
}


// ==========================================================
// PERMISSION OVERWRITES
// ==========================================================

function buildPermissionOverwrites(
    overwrites,
    roleMap,
    guild
) {

    if (!Array.isArray(overwrites)) {
        return [];
    }

    const result = [];

    for (const overwrite of overwrites) {

        let targetId;

        // ==================================================
        // ROLE
        // ==================================================

        if (
            overwrite.type === 0 ||
            overwrite.type === "role"
        ) {

            targetId =
                roleMap.get(
                    overwrite.id
                );

            // @everyone
            if (!targetId) {

                if (
                    overwrite.id ===
                    guild.id
                ) {

                    targetId =
                        guild.id;

                } else {

                    continue;
                }
            }
        }

        // ==================================================
        // MEMBER
        // ==================================================

        else if (
            overwrite.type === 1 ||
            overwrite.type === "member"
        ) {

            const member =
                guild.members.cache.get(
                    overwrite.id
                );

            // Don't restore member overwrites
            // for users who aren't in this server.
            if (!member) {
                continue;
            }

            targetId =
                overwrite.id;
        }

        if (!targetId) {
            continue;
        }

        result.push({

            id:
                targetId,

            allow:
                BigInt(
                    overwrite.allow || "0"
                ),

            deny:
                BigInt(
                    overwrite.deny || "0"
                )
        });
    }

    return result;
}