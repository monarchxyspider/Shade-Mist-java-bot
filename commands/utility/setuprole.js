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
    description: "Create a complete server role hierarchy.",

    async execute(client, message) {

        if (!message.guild) {
            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        const guild = message.guild;

        // ==================================================
        // ADMIN CHECK
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
        // BOT CHECK
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
                    `${client.config.emojis.error} I need **Manage Roles** permission.`
            });
        }

        // ==================================================
        // WARNING
        // ==================================================

        const warning = new EmbedBuilder()
            .setColor(0xED4245)
            .setAuthor({
                name: `${client.config.botName} • Role System`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(
                `${client.config.emojis.warning || "⚠️"} **Complete Role Reset**\n\n` +

                `This will delete **all existing custom roles** and create a new role system.\n\n` +

                `${client.config.emojis.error} Existing custom roles will be deleted.\n` +
                `${client.config.emojis.role || "🎭"} **60+ new roles** will be created.\n` +
                `${client.config.emojis.info || "ℹ️"} Managed/bot roles cannot be deleted.\n` +
                `${client.config.emojis.success} All new roles will be **non-mentionable**.\n\n` +

                `**Do you want to continue?**`
            )
            .setFooter({
                text: `${client.config.botName} • Only the command user can confirm`
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(`roles_confirm_${message.author.id}`)
                .setLabel("Confirm")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId(`roles_cancel_${message.author.id}`)
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary)
        );

        const confirmation =
            await message.reply({
                embeds: [warning],
                components: [row]
            });

        // ==================================================
        // COLLECTOR
        // ==================================================

        const collector =
            confirmation.createMessageComponentCollector({
                filter: interaction =>
                    interaction.user.id === message.author.id,
                time: 20000,
                max: 1
            });

        collector.on("collect", async interaction => {

            if (
                interaction.customId ===
                `roles_cancel_${message.author.id}`
            ) {

                return interaction.update({
                    content:
                        `${client.config.emojis.error} **Role setup cancelled.**`,
                    embeds: [],
                    components: []
                });
            }

            if (
                interaction.customId ===
                `roles_confirm_${message.author.id}`
            ) {

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.embedColor)
                            .setDescription(
                                `${client.config.emojis.loading || "⏳"} **Starting complete role setup...**`
                            )
                    ],
                    components: []
                });

                await createRoles(
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
                await confirmation.edit({
                    content:
                        `${client.config.emojis.error} **Role setup cancelled.**\n\nNo confirmation received.`,
                    embeds: [],
                    components: []
                });
            } catch {}
        });
    }
};


// ==========================================================
// CREATE ROLES
// ==========================================================

async function createRoles(
    client,
    guild,
    interaction
) {

    try {

        // ==================================================
        // ROLE LIST
        // ==================================================

        const roles = [

            // ==============================================
            // LEADERSHIP
            // ==============================================

            ["「Owner」", 0xE74C3C],
            ["「Co-Owner」", 0xC0392B],
            ["「Founder」", 0xE67E22],
            ["「Head Admin」", 0xFF4757],
            ["「Admin」", 0xFF6B6B],
            ["「Junior Admin」", 0xFF7675],

            // ==============================================
            // MANAGEMENT
            // ==============================================

            ["「Server Manager」", 0x9B59B6],
            ["「Community Manager」", 0x8E44AD],
            ["「Executive Staff」", 0x7D3C98],
            ["「Senior Staff」", 0x6C3483],
            ["「Staff Team」", 0x3498DB],

            // ==============================================
            // MODERATION
            // ==============================================

            ["「Head Moderator」", 0xFF8C42],
            ["「Senior Moderator」", 0xFFA502],
            ["「Moderator」", 0xFFB142],
            ["「Junior Moderator」", 0xF39C12],
            ["「Trial Moderator」", 0xF1C40F],
            ["「Chat Moderator」", 0xE1B12C],
            ["「Voice Moderator」", 0xD4AC0D],

            // ==============================================
            // SECURITY
            // ==============================================

            ["「Head Security」", 0x2C3E50],
            ["「Security Team」", 0x34495E],
            ["「Anti-Raid Team」", 0x1ABC9C],
            ["「Anti-Nuke Team」", 0x16A085],

            // ==============================================
            // TICKET TEAM
            // ==============================================

            ["「Ticket Manager」", 0x2980B9],
            ["「Head Ticket Moderator」", 0x3498DB],
            ["「Ticket Moderator」", 0x5DADE2],
            ["「Ticket Support」", 0x85C1E9],
            ["「Ticket Helper」", 0xAED6F1],

            // ==============================================
            // ANNOUNCEMENTS
            // ==============================================

            ["「Announcement Team」", 0xF1C40F],
            ["「Announcement」", 0xF4D03F],
            ["「News Team」", 0xF7DC6F],

            // ==============================================
            // PINGS
            // ALL NORMAL COLOR
            // ==============================================

            ["「Announcement Ping」", 0],
            ["「Social Ping」", 0],
            ["「YT Ping」", 0],
            ["「Twitch Ping」", 0],
            ["「TikTok Ping」", 0],
            ["「Instagram Ping」", 0],
            ["「Giveaway Ping」", 0],
            ["「Quick Giveaway Ping」", 0],
            ["「Invite Reward Ping」", 0],
            ["「Boost Ping」", 0],
            ["「Event Ping」", 0],
            ["「Poll Ping」", 0],
            ["「Update Ping」", 0],
            ["「18+ Ping」", 0],

            // ==============================================
            // CREATOR
            // ==============================================

            ["「Content Creator」", 0xE84393],
            ["「Streamer」", 0x9B59B6],
            ["「YouTuber」", 0xFF0000],
            ["「TikToker」", 0x111111],
            ["「Artist」", 0xE056FD],

            // ==============================================
            // COMMUNITY
            // ==============================================

            ["「Verified」", 0x2ECC71],
            ["「Active Member」", 0x27AE60],
            ["「Online Members」", 0x58D68D],
            ["「Member」", 0x95A5A6],
            ["「New Member」", 0xBDC3C7],

            // ==============================================
            // REWARDS
            // ==============================================

            ["「Booster」", 0xF47FFF],
            ["「Top Booster」", 0xFF73FA],
            ["「Invite Champion」", 0xF1C40F],
            ["「Invite Reward」", 0xF39C12],
            ["「Giveaway Winner」", 0xFFD700],
            ["「Event Winner」", 0x2ECC71],

            // ==============================================
            // SPECIAL
            // ==============================================

            ["「VIP」", 0xFFD700],
            ["「OG Member」", 0xD4AF37],
            ["「Early Supporter」", 0x5865F2],
            ["「Partner」", 0x00B894],
            ["「Friend」", 0x74B9FF],
            ["「Retired Staff」", 0x7F8C8D]
        ];

        // ==================================================
        // STATUS
        // ==================================================

        const update = async text => {

            try {

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.embedColor)
                            .setAuthor({
                                name:
                                    `${client.config.botName} • Role System`,
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
        // DELETE EXISTING ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Removing existing custom roles...**`
        );

        const existingRoles =
            [...guild.roles.cache.values()]
                .filter(role =>
                    role.id !== guild.id
                )
                .filter(role =>
                    !role.managed
                )
                .sort(
                    (a, b) =>
                        b.position - a.position
                );

        let deleted = 0;

        for (const role of existingRoles) {

            try {

                await role.delete(
                    "Complete role system reset"
                );

                deleted++;

            } catch (error) {

                console.log(
                    `Cannot delete ${role.name}:`,
                    error.message
                );
            }
        }

        // ==================================================
        // CREATE ROLES
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Creating ${roles.length} roles...**`
        );

        const created = [];

        for (const [name, color] of roles) {

            try {

                const role =
                    await guild.roles.create({

                        name,

                        color,

                        hoist: false,

                        mentionable: false,

                        permissions: 0n,

                        reason:
                            "Complete server role system"
                    });

                created.push(role);

            } catch (error) {

                console.log(
                    `Cannot create ${name}:`,
                    error.message
                );
            }
        }

        // ==================================================
        // HIERARCHY
        // ==================================================

        await update(
            `${client.config.emojis.loading || "⏳"} **Organizing role hierarchy...**`
        );

        const positions = [];

        for (
            let i = 0;
            i < created.length;
            i++
        ) {

            positions.push({
                role:
                    created[i].id,

                position:
                    created.length - i
            });
        }

        if (positions.length) {

            try {

                await guild.roles.setPositions({
                    positions
                });

            } catch (error) {

                console.log(
                    "Hierarchy error:",
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
                    .setColor(client.config.embedColor)

                    .setAuthor({
                        name:
                            `${client.config.botName} • Role System Ready`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })

                    .setDescription(

                        `${client.config.emojis.success} **Role System Successfully Created!**\n\n` +

                        `${client.config.emojis.role || "🎭"} **Roles Created:** ` +
                        `\`${created.length}\`\n` +

                        `${client.config.emojis.error} **Roles Deleted:** ` +
                        `\`${deleted}\`\n\n` +

                        `**Hierarchy**\n` +

                        created
                            .map(role => `> ${role}`)
                            .join("\n") +

                        `\n\n` +

                        `${client.config.emojis.success} All roles are **non-mentionable**.\n` +

                        `${client.config.emojis.info || "ℹ️"} Ping roles use the **normal/default color**.`
                    )

                    .setFooter({
                        text:
                            `${client.config.botName} • Complete Role System`
                    })

                    .setTimestamp()
            ],

            components: []
        });

    } catch (error) {

        console.error(
            "Role System Error:",
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