const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "setup-roles",
    aliases: ["rolesetup", "resetroles"],
    description: "Delete existing roles and create the complete staff role hierarchy.",

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
        // ADMINISTRATOR CHECK
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Administrator** permission to use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION CHECK
        // ==================================================

        const botMember = guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Manage Roles** permission to setup the roles.`
            });
        }

        // ==================================================
        // WARNING
        // ==================================================

        const warning = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setAuthor({
                        name: `${client.config.botName} • Role Setup`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.warning || "⚠️"} **Role Setup Warning**\n\n` +
                        `This will delete **all existing custom roles** and create a new role hierarchy.\n\n` +
                        `${client.config.emojis.error} Existing custom roles will be removed.\n` +
                        `${client.config.emojis.info || "ℹ️"} Bot/managed roles cannot be deleted.\n\n` +
                        `React with ✅ within **15 seconds** to continue.`
                    )
                    .setTimestamp()
            ]
        });

        await warning.react("✅");

        const filter = (reaction, user) =>
            reaction.emoji.name === "✅" &&
            user.id === message.author.id;

        try {
            await warning.awaitReactions({
                filter,
                max: 1,
                time: 15000,
                errors: ["time"]
            });
        } catch {
            return warning.edit({
                content:
                    `${client.config.emojis.error} **Role setup cancelled.**`,
                embeds: []
            });
        }

        // ==================================================
        // START
        // ==================================================

        const status = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Role Setup`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Removing existing roles...**`
                    )
                    .setTimestamp()
            ]
        });

        try {

            // ==================================================
            // DELETE EXISTING CUSTOM ROLES
            // ==================================================

            const roles = [...guild.roles.cache.values()]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .sort((a, b) => b.position - a.position);

            let deleted = 0;

            for (const role of roles) {
                try {
                    await role.delete("Role hierarchy reset");
                    deleted++;
                } catch (error) {
                    console.log(
                        `Could not delete role ${role.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // ROLE DEFINITIONS
            // ==================================================

            const roleData = [

                // ================================
                // TOP STAFF
                // ================================

                {
                    name: "「Owner」",
                    color: 0xE74C3C
                },

                {
                    name: "「Head Admin」",
                    color: 0xFF4757
                },

                {
                    name: "「Admin」",
                    color: 0xFF6B6B
                },

                // ================================
                // MODERATION
                // ================================

                {
                    name: "「Head Moderator」",
                    color: 0xFF8C42
                },

                {
                    name: "「Moderator」",
                    color: 0xFFA502
                },

                {
                    name: "「Trial Moderator」",
                    color: 0xFFB142
                },

                // ================================
                // ANNOUNCEMENT
                // ================================

                {
                    name: "「Announcement」",
                    color: 0xF1C40F
                },

                // ================================
                // PINGS
                // Normal Discord role color
                // ================================

                {
                    name: "「YT Ping」",
                    color: 0
                },

                {
                    name: "「Social Ping」",
                    color: 0
                },

                {
                    name: "「18+ Ping」",
                    color: 0
                },

                // ================================
                // STAFF
                // ================================

                {
                    name: "「Executive Staff」",
                    color: 0x8E44AD
                },

                {
                    name: "「Staff Team」",
                    color: 0x3498DB
                },

                {
                    name: "「Ticket Moderator」",
                    color: 0x2980B9
                },

                // ================================
                // MEMBERS
                // ================================

                {
                    name: "「Online Members」",
                    color: 0x2ECC71
                },

                {
                    name: "「Members」",
                    color: 0x95A5A6
                },

                // ================================
                // SPECIAL
                // ================================

                {
                    name: "「Retired Staff」",
                    color: 0x7F8C8D
                }
            ];

            // ==================================================
            // CREATE ROLES
            // ==================================================

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setAuthor({
                            name: `${client.config.botName} • Role Setup`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating ${roleData.length} roles...**`
                        )
                ]
            });

            const createdRoles = [];

            for (const data of roleData) {

                try {

                    const role = await guild.roles.create({
                        name: data.name,

                        // 0 = Discord's default/no color
                        color: data.color,

                        hoist: false,

                        // No role will be mentionable
                        mentionable: false,

                        // No permissions
                        permissions: 0n,

                        reason: "Server role hierarchy setup"
                    });

                    createdRoles.push(role);

                } catch (error) {

                    console.log(
                        `Could not create role ${data.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // ROLE ORDER
            // ==================================================

            const positions = [];

            for (
                let i = 0;
                i < createdRoles.length;
                i++
            ) {

                const role = createdRoles[i];

                positions.push({
                    role: role.id,
                    position:
                        createdRoles.length - i
                });
            }

            if (positions.length) {

                try {

                    await guild.roles.setPositions({
                        positions
                    });

                } catch (error) {

                    console.log(
                        "Role positioning error:",
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
                        .setColor(client.config.embedColor)
                        .setAuthor({
                            name:
                                `${client.config.botName} • Roles Created`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.success} **Role Setup Complete!**\n\n` +

                            `${client.config.emojis.role || "🎭"} **Roles Created:** ` +
                            `\`${createdRoles.length}\`\n` +

                            `${client.config.emojis.error} **Roles Deleted:** ` +
                            `\`${deleted}\`\n\n` +

                            `**Role Hierarchy**\n` +
                            createdRoles
                                .map(role => `> ${role}`)
                                .join("\n") +

                            `\n\n${client.config.emojis.success} All roles are **non-mentionable**.`
                        )
                        .setFooter({
                            text:
                                `${client.config.botName} • Role System`
                        })
                        .setTimestamp()
                ]
            });

        } catch (error) {

            console.error(
                "Role Setup Error:",
                error
            );

            return status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setDescription(
                            `${client.config.emojis.error} **Role setup failed.**\n\n` +
                            `**Reason:**\n` +
                            `\`${error.message || "Unknown error"}\``
                        )
                        .setTimestamp()
                ]
            });
        }
    }
};