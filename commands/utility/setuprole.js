const {
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "setup-roles",
    aliases: ["rolesetup", "resetroles"],
    description: "Reset and create the server role hierarchy.",

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
        // WARNING EMBED
        // ==================================================

        const warningEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setAuthor({
                name: `${client.config.botName} • Role Setup`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(
                `${client.config.emojis.warning || "⚠️"} **Role Setup Warning**\n\n` +

                `This command will **delete all existing custom roles** and create a new role hierarchy.\n\n` +

                `${client.config.emojis.error} Existing custom roles will be deleted.\n` +
                `${client.config.emojis.info || "ℹ️"} Managed/bot roles cannot be deleted.\n` +
                `${client.config.emojis.role || "🎭"} New roles will be **non-mentionable**.\n\n` +

                `**Are you sure you want to continue?**`
            )
            .setFooter({
                text: `${client.config.botName} • Only you can use these buttons`
            })
            .setTimestamp();

        // ==================================================
        // BUTTONS
        // ==================================================

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(`setup_roles_confirm_${message.author.id}`)
                .setLabel("Confirm")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId(`setup_roles_cancel_${message.author.id}`)
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary)
        );

        // ==================================================
        // SEND CONFIRMATION
        // ==================================================

        const confirmationMessage = await message.reply({
            embeds: [warningEmbed],
            components: [row]
        });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            confirmationMessage.createMessageComponentCollector({
                filter: interaction =>
                    interaction.user.id === message.author.id,

                time: 20000,
                max: 1
            });

        // ==================================================
        // BUTTON CLICK
        // ==================================================

        collector.on("collect", async interaction => {

            // ==================================================
            // CANCEL
            // ==================================================

            if (
                interaction.customId ===
                `setup_roles_cancel_${message.author.id}`
            ) {

                return interaction.update({
                    content:
                        `${client.config.emojis.error} **Role setup cancelled.**`,
                    embeds: [],
                    components: []
                });
            }

            // ==================================================
            // CONFIRM
            // ==================================================

            if (
                interaction.customId ===
                `setup_roles_confirm_${message.author.id}`
            ) {

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.embedColor)
                            .setAuthor({
                                name:
                                    `${client.config.botName} • Role Setup`,
                                iconURL:
                                    client.user.displayAvatarURL()
                            })
                            .setDescription(
                                `${client.config.emojis.loading || "⏳"} **Starting role setup...**`
                            )
                            .setTimestamp()
                    ],
                    components: []
                });

                await setupRoles(
                    client,
                    guild,
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
                        `${client.config.emojis.error} **Role setup cancelled.**\n\n` +
                        `No confirmation was received within 20 seconds.`,
                    embeds: [],
                    components: []
                });

            } catch {}
        });
    }
};


// ==========================================================
// SETUP ROLES
// ==========================================================

async function setupRoles(
    client,
    guild,
    interaction
) {

    try {

        // ==================================================
        // ROLE DEFINITIONS
        // ==================================================

        const roleData = [

            // TOP
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

            // MODERATION
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

            // ANNOUNCEMENT
            {
                name: "「Announcement」",
                color: 0xF1C40F
            },

            // PINGS — NORMAL COLOR
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

            // STAFF
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

            // MEMBERS
            {
                name: "「Online Members」",
                color: 0x2ECC71
            },

            {
                name: "「Members」",
                color: 0x95A5A6
            },

            // SPECIAL
            {
                name: "「Retired Staff」",
                color: 0x7F8C8D
            }
        ];

        // ==================================================
        // STATUS HELPER
        // ==================================================

        const update = async (text) => {

            try {

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.embedColor)
                            .setAuthor({
                                name:
                                    `${client.config.botName} • Role Setup`,
                                iconURL:
                                    client.user.displayAvatarURL()
                            })
                            .setDescription(text)
                            .setTimestamp()
                    ],
                    components: []
                });

            } catch {}
        };

        // ==================================================
        // DELETE OLD ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Removing existing custom roles...**`
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

        let deleted = 0;

        for (const role of existingRoles) {

            try {

                await role.delete(
                    "Server role hierarchy reset"
                );

                deleted++;

            } catch (error) {

                console.log(
                    `Could not delete role ${role.name}:`,
                    error.message
                );
            }
        }

        // ==================================================
        // CREATE NEW ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Creating ${roleData.length} roles...**`
        );

        const createdRoles = [];

        for (const data of roleData) {

            try {

                const role =
                    await guild.roles.create({

                        name: data.name,

                        // Pings have color 0 = normal/default
                        color: data.color,

                        hoist: false,

                        // NONE are mentionable
                        mentionable: false,

                        // No permissions by default
                        permissions: 0n,

                        reason:
                            "Server role hierarchy setup"
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
        // SET ROLE HIERARCHY
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Setting role hierarchy...**`
        );

        /*
         * Discord's position system:
         *
         * Owner
         * ↓
         * Head Admin
         * ↓
         * Admin
         * ↓
         * Head Moderator
         * ↓
         * Moderator
         * ↓
         * Trial Moderator
         * ↓
         * Announcement
         * ↓
         * YT Ping
         * ↓
         * Social Ping
         * ↓
         * 18+ Ping
         * ↓
         * Executive Staff
         * ↓
         * Staff Team
         * ↓
         * Ticket Moderator
         * ↓
         * Online Members
         * ↓
         * Members
         */

        const positions = [];

        for (
            let i = 0;
            i < createdRoles.length;
            i++
        ) {

            const role =
                createdRoles[i];

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

        await interaction.editReply({

            embeds: [

                new EmbedBuilder()
                    .setColor(
                        client.config.embedColor
                    )

                    .setAuthor({
                        name:
                            `${client.config.botName} • Role Setup Complete`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })

                    .setDescription(

                        `${client.config.emojis.success} **Role Setup Complete!**\n\n` +

                        `${client.config.emojis.role || "🎭"} **Roles Created:** ` +
                        `\`${createdRoles.length}\`\n` +

                        `${client.config.emojis.error} **Roles Deleted:** ` +
                        `\`${deleted}\`\n\n` +

                        `**New Role Hierarchy**\n` +

                        createdRoles
                            .map(role => `> ${role}`)
                            .join("\n") +

                        `\n\n` +

                        `${client.config.emojis.success} All roles are **non-mentionable**.\n` +
                        `${client.config.emojis.info || "ℹ️"} Ping roles use the **normal/default color**.`
                    )

                    .setFooter({
                        text:
                            `${client.config.botName} • Role System`
                    })

                    .setTimestamp()
            ],

            components: []
        });

    } catch (error) {

        console.error(
            "Role Setup Error:",
            error
        );

        try {

            await interaction.editReply({

                embeds: [

                    new EmbedBuilder()
                        .setColor(0xED4245)

                        .setAuthor({
                            name:
                                `${client.config.botName} • Setup Failed`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })

                        .setDescription(
                            `${client.config.emojis.error} **Role setup failed.**\n\n` +

                            `**Reason:**\n` +
                            `> ${error.message || "Unknown error"}`
                        )

                        .setTimestamp()
                ],

                components: []
            });

        } catch {}
    }
}