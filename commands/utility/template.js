const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");

module.exports = {
    name: "template",
    aliases: [],
    description: "Restore a Discord server template into this server.",

    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Restore a Discord server template into this server.")
        .addStringOption(option =>
            option
                .setName("code")
                .setDescription("Discord server template code or URL")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, message, args) {
        // --------------------------------------------------
        // GET TEMPLATE CODE
        // --------------------------------------------------

        const code = message?.options
            ? message.options.getString("code")
            : args[0];

        if (!code) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please provide a valid Discord server template code or URL.`
            });
        }

        let templateCode = code.trim();

        // Supports:
        // FKvmczH2HyUf
        // https://discord.new/FKvmczH2HyUf
        // https://discord.com/template/FKvmczH2HyUf

        const match = templateCode.match(
            /(?:discord\.new\/|discord(?:app)?\.com\/template\/)([a-zA-Z0-9-]+)/
        );

        if (match) {
            templateCode = match[1];
        }

        // --------------------------------------------------
        // PERMISSION CHECK
        // --------------------------------------------------

        if (
            !message.member ||
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Administrator** permission to use this command.`
            });
        }

        // --------------------------------------------------
        // BOT PERMISSION CHECK
        // --------------------------------------------------

        const botMember = message.guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(PermissionFlagsBits.Administrator)
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Administrator** permission to restore a server template.`
            });
        }

        // --------------------------------------------------
        // FETCH TEMPLATE
        // --------------------------------------------------

        let template;

        try {
            template = await client.fetchGuildTemplate(templateCode);
        } catch (error) {
            console.error("Template fetch error:", error);

            return message.reply({
                content:
                    `${client.config.emojis.error} **Template doesn't exist or cannot be accessed.**`
            });
        }

        // --------------------------------------------------
        // CONFIRMATION
        // --------------------------------------------------

        const warning = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setAuthor({
                        name: `${client.config.botName} • Template Restore`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.warning || "⚠️"} **Warning!**\n\n` +
                        `You are about to restore the template:\n\n` +
                        `> **${template.name}**\n` +
                        `> Code: \`${template.code}\`\n\n` +
                        `This may delete the current server channels and roles.\n\n` +
                        `React with ✅ within **15 seconds** to continue.`
                    )
                    .setFooter({
                        text: "This action can modify your server structure."
                    })
                    .setTimestamp()
            ]
        });

        await warning.react("✅");

        const filter = (reaction, user) =>
            reaction.emoji.name === "✅" &&
            user.id === message.author.id;

        let confirmation;

        try {
            confirmation = await warning.awaitReactions({
                filter,
                max: 1,
                time: 15000,
                errors: ["time"]
            });
        } catch {
            return warning.edit({
                content:
                    `${client.config.emojis.error} Template restore cancelled.`,
                embeds: []
            });
        }

        if (!confirmation.size) {
            return warning.edit({
                content:
                    `${client.config.emojis.error} Template restore cancelled.`,
                embeds: []
            });
        }

        // --------------------------------------------------
        // START RESTORE
        // --------------------------------------------------

        const status = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Restoring Template`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Starting template restore...**`
                    )
                    .setTimestamp()
            ]
        });

        try {
            const guild = message.guild;

            // --------------------------------------------------
            // GET SERIALIZED GUILD
            // --------------------------------------------------

            const serialized = template.serializedGuild;

            if (!serialized) {
                throw new Error(
                    "This Discord template does not contain serialized guild data."
                );
            }

            // --------------------------------------------------
            // DELETE EXISTING CHANNELS
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Removing existing channels...**`
                        )
                ]
            });

            const existingChannels = [...guild.channels.cache.values()];

            for (const channel of existingChannels) {
                try {
                    await channel.delete("Discord template restore");
                } catch (error) {
                    console.log(
                        `Could not delete channel ${channel.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // DELETE EXISTING CUSTOM ROLES
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Removing existing roles...**`
                        )
                ]
            });

            const existingRoles = [...guild.roles.cache.values()]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .sort((a, b) => b.position - a.position);

            for (const role of existingRoles) {
                try {
                    await role.delete("Discord template restore");
                } catch (error) {
                    console.log(
                        `Could not delete role ${role.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // ROLE MAP
            // --------------------------------------------------

            const roleMap = new Map();

            // @everyone role
            if (serialized.roles?.length) {
                const everyoneTemplateRole = serialized.roles.find(
                    role => role.id === serialized.id
                );

                if (everyoneTemplateRole) {
                    roleMap.set(
                        everyoneTemplateRole.id,
                        guild.roles.everyone.id
                    );
                }
            }

            // --------------------------------------------------
            // CREATE ROLES
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating roles...**`
                        )
                ]
            });

            const templateRoles = (serialized.roles || [])
                .filter(role => role.id !== serialized.id)
                .filter(role => !role.managed)
                .sort((a, b) => a.position - b.position);

            for (const roleData of templateRoles) {
                try {
                    const newRole = await guild.roles.create({
                        name: roleData.name || "New Role",
                        color: roleData.color || 0,
                        hoist: roleData.hoist || false,
                        mentionable: roleData.mentionable || false,
                        permissions: roleData.permissions || "0",
                        reason: "Discord template restore"
                    });

                    roleMap.set(roleData.id, newRole.id);
                } catch (error) {
                    console.log(
                        `Could not create role ${roleData.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // FIX ROLE POSITIONS
            // --------------------------------------------------

            const rolePositions = [];

            for (const roleData of templateRoles) {
                const newRoleId = roleMap.get(roleData.id);

                if (!newRoleId) continue;

                rolePositions.push({
                    role: newRoleId,
                    position: roleData.position || 1
                });
            }

            if (rolePositions.length) {
                try {
                    await guild.roles.setPositions({
                        positions: rolePositions
                    });
                } catch (error) {
                    console.log(
                        "Could not set role positions:",
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // CREATE CATEGORIES FIRST
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating categories...**`
                        )
                ]
            });

            const channelMap = new Map();

            const templateChannels = serialized.channels || [];

            const categories = templateChannels
                .filter(channel =>
                    channel.type === ChannelType.GuildCategory ||
                    channel.type === 4
                )
                .sort((a, b) => a.position - b.position);

            for (const category of categories) {
                try {
                    const newCategory = await guild.channels.create({
                        name: category.name || "Category",
                        type: ChannelType.GuildCategory,
                        position: category.position || 0,
                        permissionOverwrites: buildPermissionOverwrites(
                            category.permission_overwrites,
                            roleMap,
                            guild
                        ),
                        reason: "Discord template restore"
                    });

                    channelMap.set(category.id, newCategory.id);
                } catch (error) {
                    console.log(
                        `Could not create category ${category.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // CREATE NORMAL CHANNELS
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating channels...**`
                        )
                ]
            });

            const normalChannels = templateChannels
                .filter(channel =>
                    channel.type !== ChannelType.GuildCategory &&
                    channel.type !== 4
                )
                .sort((a, b) => a.position - b.position);

            for (const channelData of normalChannels) {
                try {
                    let type = channelData.type;

                    // Valid Discord channel types
                    if (
                        ![
                            ChannelType.GuildText,
                            ChannelType.GuildVoice,
                            ChannelType.GuildAnnouncement,
                            ChannelType.GuildStageVoice,
                            ChannelType.GuildForum,
                            ChannelType.GuildMedia
                        ].includes(type)
                    ) {
                        type = ChannelType.GuildText;
                    }

                    const options = {
                        name: channelData.name || "channel",
                        type,
                        position: channelData.position || 0,
                        reason: "Discord template restore"
                    };

                    // Category
                    if (channelData.parent_id) {
                        const parentId = channelMap.get(
                            channelData.parent_id
                        );

                        if (parentId) {
                            options.parent = parentId;
                        }
                    }

                    // Text channel
                    if (
                        type === ChannelType.GuildText ||
                        type === ChannelType.GuildAnnouncement
                    ) {
                        if (channelData.topic) {
                            options.topic = channelData.topic;
                        }

                        if (channelData.nsfw !== undefined) {
                            options.nsfw = channelData.nsfw;
                        }

                        if (channelData.rate_limit_per_user !== undefined) {
                            options.rateLimitPerUser =
                                channelData.rate_limit_per_user;
                        }
                    }

                    // Voice channel
                    if (
                        type === ChannelType.GuildVoice ||
                        type === ChannelType.GuildStageVoice
                    ) {
                        if (channelData.bitrate) {
                            options.bitrate = Math.min(
                                channelData.bitrate,
                                guild.maximumBitrate
                            );
                        }

                        if (channelData.user_limit !== undefined) {
                            options.userLimit =
                                channelData.user_limit;
                        }
                    }

                    // Permission overwrites
                    const overwrites =
                        buildPermissionOverwrites(
                            channelData.permission_overwrites,
                            roleMap,
                            guild
                        );

                    if (overwrites.length) {
                        options.permissionOverwrites = overwrites;
                    }

                    const newChannel =
                        await guild.channels.create(options);

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

            // --------------------------------------------------
            // FINISH
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setAuthor({
                            name: `${client.config.botName} • Template Restored`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.success} **Template successfully restored!**\n\n` +
                            `${client.config.emojis.server} **Template:** ${template.name}\n` +
                            `${client.config.emojis.role || "🎭"} **Roles:** ${roleMap.size - 1}\n` +
                            `${client.config.emojis.channel || "📁"} **Channels:** ${channelMap.size}\n\n` +
                            `The server structure has been recreated from the template.`
                        )
                        .setFooter({
                            text: client.config.botName
                        })
                        .setTimestamp()
                ]
            });

        } catch (error) {
            console.error("Template restore error:", error);

            return status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setDescription(
                            `${client.config.emojis.error} **Template restore failed.**\n\n` +
                            `\`\`\`${error.message.slice(0, 1500)}\`\`\``
                        )
                        .setTimestamp()
                ]
            });
        }
    }
};


// ==========================================================
// PERMISSION OVERWRITE BUILDER
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

        // Role overwrite
        if (overwrite.type === 0 || overwrite.type === "role") {
            targetId = roleMap.get(overwrite.id);

            if (!targetId) {
                // @everyone
                if (overwrite.id === guild.id) {
                    targetId = guild.id;
                } else {
                    continue;
                }
            }
        }

        // Member overwrite
        else if (
            overwrite.type === 1 ||
            overwrite.type === "member"
        ) {
            // Only restore users that are still in the server
            const member = guild.members.cache.get(overwrite.id);

            if (!member) continue;

            targetId = overwrite.id;
        }

        if (!targetId) continue;

        result.push({
            id: targetId,
            allow: BigInt(overwrite.allow || 0),
            deny: BigInt(overwrite.deny || 0)
        });
    }

    return result;
}