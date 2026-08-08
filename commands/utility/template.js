const {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
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
        // GET TEMPLATE CODE
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

        if (!client.templates) {
            return message.reply({
                content:
                    `${client.config.emojis.error} **Template storage is not configured.**`
            });
        }

        const template = client.templates.get(code);

        if (!template) {
            return message.reply({
                content:
                    `${client.config.emojis.error} **Template not found.**\n\n` +
                    `Make sure the code is correct and the template was created while this bot was online.`
            });
        }

        // ==================================================
        // CONFIRMATION EMBED
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
                `${client.config.emojis.warning || "⚠️"} **Restore Server Template?**\n\n` +

                `${client.config.emojis.server} **Source Server**\n` +
                `> ${template.sourceGuildName}\n\n` +

                `${client.config.emojis.message} **Template Code**\n` +
                `> \`${code}\`\n\n` +

                `${client.config.emojis.role || "🎭"} **Roles**\n` +
                `> ${template.roles.length}\n\n` +

                `${client.config.emojis.channel || "📁"} **Channels**\n` +
                `> ${template.channels.length}\n\n` +

                `${client.config.emojis.error} **Warning**\n` +
                `> Existing channels and custom roles in this server will be deleted.\n\n` +

                `Are you sure you want to continue?`
            )

            .setFooter({
                text:
                    `${client.config.botName} • You have 20 seconds to choose`
            })

            .setTimestamp();

        // ==================================================
        // BUTTONS
        // ==================================================

        const buttons = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(
                    `template_confirm_${message.author.id}`
                )
                .setLabel("Confirm")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId(
                    `template_cancel_${message.author.id}`
                )
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary)
        );

        const confirmationMessage = await message.reply({
            embeds: [warning],
            components: [buttons]
        });

        // ==================================================
        // BUTTON COLLECTOR
        // ==================================================

        const collector =
            confirmationMessage.createMessageComponentCollector({
                filter: interaction =>
                    interaction.user.id ===
                    message.author.id,

                time: 20000,
                max: 1
            });

        collector.on("collect", async interaction => {

            // ==================================================
            // CANCEL
            // ==================================================

            if (
                interaction.customId ===
                `template_cancel_${message.author.id}`
            ) {

                await interaction.update({
                    content:
                        `${client.config.emojis.error} **Template restore cancelled.**`,
                    embeds: [],
                    components: []
                });

                return;
            }

            // ==================================================
            // CONFIRM
            // ==================================================

            if (
                interaction.customId ===
                `template_confirm_${message.author.id}`
            ) {

                await interaction.update({
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
                            .setDescription(
                                `${client.config.emojis.loading || "⏳"} **Starting template restore...**`
                            )
                            .setTimestamp()
                    ],
                    components: []
                });

                await restoreTemplate(
                    client,
                    guild,
                    template,
                    code,
                    interaction
                );
            }
        });

        // ==================================================
        // TIMEOUT
        // ==================================================

        collector.on("end", async collected => {

            if (collected.size > 0) return;

            try {

                await confirmationMessage.edit({
                    content:
                        `${client.config.emojis.error} **Template restore cancelled.**\n\n` +
                        `No confirmation was received within 20 seconds.`,
                    embeds: [],
                    components: []
                });

            } catch {}
        });
    }
};


// ==========================================================
// RESTORE TEMPLATE
// ==========================================================

async function restoreTemplate(
    client,
    guild,
    template,
    code,
    interaction
) {

    try {

        // ==================================================
        // ROLE MAP
        // ==================================================

        const roleMap = new Map();

        roleMap.set(
            template.everyoneRoleId,
            guild.roles.everyone.id
        );

        // ==================================================
        // STATUS FUNCTION
        // ==================================================

        const update = async text => {

            try {

                await interaction.editReply({
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

            } catch {}
        };

        // ==================================================
        // DELETE CHANNELS
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Removing existing channels...**`
        );

        const existingChannels = [
            ...guild.channels.cache.values()
        ];

        for (const channel of existingChannels) {

            try {

                await channel.delete(
                    "Custom template restore"
                );

            } catch (error) {

                console.log(
                    `Channel delete failed: ${channel.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // DELETE ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Removing existing roles...**`
        );

        const existingRoles = [
            ...guild.roles.cache.values()
        ]
            .filter(role => role.id !== guild.id)
            .filter(role => !role.managed)
            .sort(
                (a, b) =>
                    b.position - a.position
            );

        for (const role of existingRoles) {

            try {

                await role.delete(
                    "Custom template restore"
                );

            } catch (error) {

                console.log(
                    `Role delete failed: ${role.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // CREATE ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Creating roles...**`
        );

        const templateRoles =
            [...template.roles]
                .filter(
                    role =>
                        role.id !==
                        template.everyoneRoleId
                )
                .sort(
                    (a, b) =>
                        a.position - b.position
                );

        let rolesCreated = 0;

        for (const roleData of templateRoles) {

            try {

                const newRole =
                    await guild.roles.create({

                        name:
                            roleData.name ||
                            "Role",

                        color:
                            roleData.color ||
                            0,

                        hoist:
                            roleData.hoist ||
                            false,

                        mentionable:
                            roleData.mentionable ||
                            false,

                        permissions:
                            BigInt(
                                roleData.permissions ||
                                "0"
                            ),

                        reason:
                            "Custom template restore"
                    });

                roleMap.set(
                    roleData.id,
                    newRole.id
                );

                rolesCreated++;

            } catch (error) {

                console.log(
                    `Role creation failed: ${roleData.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // ROLE POSITIONS
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Restoring role positions...**`
        );

        const rolePositions = [];

        for (const roleData of templateRoles) {

            const newRoleId =
                roleMap.get(
                    roleData.id
                );

            if (!newRoleId) continue;

            rolePositions.push({
                role:
                    newRoleId,

                position:
                    roleData.position
            });
        }

        if (rolePositions.length) {

            try {

                await guild.roles.setPositions({
                    positions:
                        rolePositions
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

        const templateChannels =
            [...template.channels]
                .sort(
                    (a, b) =>
                        a.position - b.position
                );

        // ==================================================
        // CATEGORIES
        // ==================================================

        await update(
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

                const overwrites =
                    buildPermissionOverwrites(
                        category.permissionOverwrites,
                        roleMap,
                        guild
                    );

                const newCategory =
                    await guild.channels.create({

                        name:
                            category.name ||
                            "Category",

                        type:
                            ChannelType.GuildCategory,

                        permissionOverwrites:
                            overwrites,

                        reason:
                            "Custom template restore"
                    });

                channelMap.set(
                    category.id,
                    newCategory.id
                );

            } catch (error) {

                console.log(
                    `Category creation failed: ${category.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // NORMAL CHANNELS
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Creating channels...**`
        );

        const normalChannels =
            templateChannels.filter(
                channel =>
                    channel.type !==
                    ChannelType.GuildCategory
            );

        let channelsCreated = 0;

        for (const channelData of normalChannels) {

            try {

                const options = {

                    name:
                        channelData.name ||
                        "channel",

                    type:
                        getSafeChannelType(
                            channelData.type
                        ),

                    reason:
                        "Custom template restore"
                };

                // Parent category

                if (channelData.parentId) {

                    const parentId =
                        channelMap.get(
                            channelData.parentId
                        );

                    if (parentId) {
                        options.parent =
                            parentId;
                    }
                }

                // Permissions

                const overwrites =
                    buildPermissionOverwrites(
                        channelData.permissionOverwrites,
                        roleMap,
                        guild
                    );

                if (overwrites.length) {
                    options.permissionOverwrites =
                        overwrites;
                }

                // Text

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

                // Voice

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

                const newChannel =
                    await guild.channels.create(
                        options
                    );

                channelMap.set(
                    channelData.id,
                    newChannel.id
                );

                channelsCreated++;

            } catch (error) {

                console.log(
                    `Channel creation failed: ${channelData.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // CHANNEL POSITIONS
        // ==================================================

        await update(
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

        await interaction.editReply({
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

                        `${client.config.emojis.message} **Template Code**\n` +
                        `> \`${code}\`\n\n` +

                        `${client.config.emojis.role || "🎭"} **Roles Created**\n` +
                        `> ${rolesCreated}\n\n` +

                        `${client.config.emojis.channel || "📁"} **Channels Created**\n` +
                        `> ${channelsCreated}\n\n` +

                        `${client.config.emojis.success} The server structure has been restored.`
                    )

                    .setFooter({
                        text:
                            `${client.config.botName} • Custom Template`
                    })

                    .setTimestamp()
            ]
        });

    } catch (error) {

        console.error(
            "Template Restore Error:",
            error
        );

        try {

            await interaction.editReply({
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

                        .setTimestamp()
                ]
            });

        } catch {}
    }
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

    return allowed.includes(type)
        ? type
        : ChannelType.GuildText;
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

        // ROLE

        if (
            overwrite.type === 0 ||
            overwrite.type === "role"
        ) {

            targetId =
                roleMap.get(
                    overwrite.id
                );

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

        // MEMBER

        else if (
            overwrite.type === 1 ||
            overwrite.type === "member"
        ) {

            const member =
                guild.members.cache.get(
                    overwrite.id
                );

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
                    overwrite.allow ||
                    "0"
                ),

            deny:
                BigInt(
                    overwrite.deny ||
                    "0"
                )
        });
    }

    return result;
}

