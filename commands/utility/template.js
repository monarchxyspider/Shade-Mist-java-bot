const {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "template",
    aliases: [],
    description: "Restore a saved server template.",

    async execute(client, message, args) {

        // ==================================================
        // GET CODE
        // ==================================================

        const code = args[0];

        if (!code) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please provide a template code.\n\n` +
                    `Example: \`s!template ABC123\``
            });
        }

        // ==================================================
        // PERMISSION CHECK
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Administrator** permission to restore a template.`
            });
        }

        const botMember = message.guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Administrator** permission to restore a template.`
            });
        }

        // ==================================================
        // GET SAVED TEMPLATE
        // ==================================================

        /*
         * The backup created by server-template.js
         * should be stored here:
         *
         * client.templates
         *
         * Example:
         *
         * client.templates = new Map();
         */

        if (!client.templates) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Template storage is not configured.`
            });
        }

        const template = client.templates.get(code);

        if (!template) {
            return message.reply({
                content:
                    `${client.config.emojis.error} **Template not found.**\n` +
                    `Please check the template code.`
            });
        }

        // ==================================================
        // CONFIRMATION
        // ==================================================

        const confirm = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setAuthor({
                        name: `${client.config.botName} • Template Restore`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.warning || "⚠️"} **Are you sure?**\n\n` +
                        `You are about to restore:\n\n` +
                        `> **${template.name}**\n\n` +
                        `This will remove the current server channels and roles.\n\n` +
                        `React with ✅ within **15 seconds** to continue.`
                    )
                    .setFooter({
                        text: "This action cannot be easily undone."
                    })
                    .setTimestamp()
            ]
        });

        await confirm.react("✅");

        const filter = (reaction, user) =>
            reaction.emoji.name === "✅" &&
            user.id === message.author.id;

        try {

            await confirm.awaitReactions({
                filter,
                max: 1,
                time: 15000,
                errors: ["time"]
            });

        } catch {

            return confirm.edit({
                content:
                    `${client.config.emojis.error} Template restore cancelled.`,
                embeds: []
            });
        }

        // ==================================================
        // STATUS
        // ==================================================

        const status = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Restoring`,
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

            // ==================================================
            // DELETE CHANNELS
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Deleting existing channels...**`
                        )
                ]
            });

            const channels = [...guild.channels.cache.values()];

            for (const channel of channels) {

                try {

                    await channel.delete(
                        "Server template restore"
                    );

                } catch (error) {

                    console.log(
                        `Channel delete error: ${channel.name}`,
                        error.message
                    );
                }
            }

            // ==================================================
            // DELETE ROLES
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Deleting existing roles...**`
                        )
                ]
            });

            const roles = [...guild.roles.cache.values()]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .sort((a, b) => b.position - a.position);

            for (const role of roles) {

                try {

                    await role.delete(
                        "Server template restore"
                    );

                } catch (error) {

                    console.log(
                        `Role delete error: ${role.name}`,
                        error.message
                    );
                }
            }

            // ==================================================
            // ROLE MAP
            // ==================================================

            const roleMap = new Map();

            // @everyone
            roleMap.set(
                template.everyoneRoleId,
                guild.roles.everyone.id
            );

            // ==================================================
            // CREATE ROLES
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating roles...**`
                        )
                ]
            });

            for (const roleData of template.roles) {

                try {

                    const role = await guild.roles.create({
                        name: roleData.name,
                        color: roleData.color,
                        hoist: roleData.hoist,
                        mentionable: roleData.mentionable,
                        permissions: roleData.permissions,
                        reason: "Server template restore"
                    });

                    roleMap.set(
                        roleData.id,
                        role.id
                    );

                } catch (error) {

                    console.log(
                        `Role create error: ${roleData.name}`,
                        error.message
                    );
                }
            }

            // ==================================================
            // ROLE POSITIONS
            // ==================================================

            for (const roleData of template.roles) {

                const newRoleId =
                    roleMap.get(roleData.id);

                if (!newRoleId) continue;

                try {

                    await guild.roles.setPosition(
                        newRoleId,
                        roleData.position
                    );

                } catch {}
            }

            // ==================================================
            // CHANNEL MAP
            // ==================================================

            const channelMap = new Map();

            // ==================================================
            // CREATE CATEGORIES
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating categories...**`
                        )
                ]
            });

            const categories =
                template.channels
                    .filter(channel =>
                        channel.type === ChannelType.GuildCategory
                    )
                    .sort(
                        (a, b) =>
                            a.position - b.position
                    );

            for (const data of categories) {

                try {

                    const category =
                        await guild.channels.create({
                            name: data.name,
                            type: ChannelType.GuildCategory,
                            position: data.position,
                            reason:
                                "Server template restore"
                        });

                    channelMap.set(
                        data.id,
                        category.id
                    );

                } catch (error) {

                    console.log(
                        `Category create error: ${data.name}`,
                        error.message
                    );
                }
            }

            // ==================================================
            // CREATE CHANNELS
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating channels...**`
                        )
                ]
            });

            const normalChannels =
                template.channels
                    .filter(channel =>
                        channel.type !==
                        ChannelType.GuildCategory
                    )
                    .sort(
                        (a, b) =>
                            a.position - b.position
                    );

            for (const data of normalChannels) {

                try {

                    const options = {
                        name: data.name,
                        type: data.type,
                        position: data.position,
                        reason:
                            "Server template restore"
                    };

                    // --------------------------
                    // CATEGORY
                    // --------------------------

                    if (data.parentId) {

                        const parent =
                            channelMap.get(
                                data.parentId
                            );

                        if (parent) {
                            options.parent = parent;
                        }
                    }

                    // --------------------------
                    // TEXT
                    // --------------------------

                    if (
                        data.type ===
                        ChannelType.GuildText
                    ) {

                        if (data.topic) {
                            options.topic =
                                data.topic;
                        }

                        if (
                            data.nsfw !== undefined
                        ) {
                            options.nsfw =
                                data.nsfw;
                        }

                        if (
                            data.rateLimitPerUser !==
                            undefined
                        ) {
                            options.rateLimitPerUser =
                                data.rateLimitPerUser;
                        }
                    }

                    // --------------------------
                    // VOICE
                    // --------------------------

                    if (
                        data.type ===
                        ChannelType.GuildVoice
                    ) {

                        if (data.bitrate) {
                            options.bitrate =
                                Math.min(
                                    data.bitrate,
                                    guild.maximumBitrate
                                );
                        }

                        if (
                            data.userLimit !==
                            undefined
                        ) {
                            options.userLimit =
                                data.userLimit;
                        }
                    }

                    const channel =
                        await guild.channels.create(
                            options
                        );

                    channelMap.set(
                        data.id,
                        channel.id
                    );

                } catch (error) {

                    console.log(
                        `Channel create error: ${data.name}`,
                        error.message
                    );
                }
            }

            // ==================================================
            // PERMISSIONS
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Restoring permissions...**`
                        )
                ]
            });

            for (const data of template.channels) {

                const newChannelId =
                    channelMap.get(data.id);

                if (!newChannelId) continue;

                const channel =
                    guild.channels.cache.get(
                        newChannelId
                    );

                if (!channel) continue;

                if (
                    !Array.isArray(
                        data.permissionOverwrites
                    )
                ) continue;

                for (
                    const overwrite
                    of data.permissionOverwrites
                ) {

                    const newRoleId =
                        roleMap.get(
                            overwrite.id
                        );

                    if (!newRoleId) continue;

                    try {

                        await channel.permissionOverwrites.edit(
                            newRoleId,
                            {
                                allow:
                                    BigInt(
                                        overwrite.allow
                                    ),
                                deny:
                                    BigInt(
                                        overwrite.deny
                                    )
                            }
                        );

                    } catch (error) {

                        console.log(
                            "Permission restore error:",
                            error.message
                        );
                    }
                }
            }

            // ==================================================
            // DONE
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setAuthor({
                            name:
                                `${client.config.botName} • Template Restored`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.success} **Template successfully restored!**\n\n` +

                            `${client.config.emojis.server} **Template**\n` +
                            `> ${template.name}\n\n` +

                            `${client.config.emojis.role || "🎭"} **Roles**\n` +
                            `> ${template.roles.length}\n\n` +

                            `${client.config.emojis.channel || "📁"} **Channels**\n` +
                            `> ${template.channels.length}\n\n` +

                            `The server structure has been restored.`
                        )
                        .setFooter({
                            text:
                                `${client.config.botName} • Template`
                        })
                        .setTimestamp()
                ]
            });

        } catch (error) {

            console.error(
                "Template Restore Error:",
                error
            );

            return status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setDescription(
                            `${client.config.emojis.error} **Template restore failed.**\n\n` +
                            `\`\`\`${error.message.slice(
                                0,
                                1500
                            )}\`\`\``
                        )
                        .setTimestamp()
                ]
            });
        }
    }
};