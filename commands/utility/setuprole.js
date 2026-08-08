const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "rolesetup",
    aliases: ["setuproles", "role-setup"],
    description: "Delete existing roles and create the server role structure.",

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
        const member = message.member;
        const botMember = guild.members.me;

        // ==================================================
        // ADMIN ONLY
        // ==================================================

        if (
            !member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Only **Administrators** can use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

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
                        name:
                            `${client.config.botName} • Role Setup`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.warning || "⚠️"} **Role Setup Warning**\n\n` +

                        `This command will:\n` +
                        `> Delete all editable custom roles\n` +
                        `> Create a completely new role structure\n` +
                        `> Set all roles to normal font\n` +
                        `> Make all created roles non-mentionable\n\n` +

                        `${client.config.emojis.info || "ℹ️"} Existing **managed/integration roles** and \`@everyone\` will not be deleted.\n\n` +

                        `React with **✅** to continue.`
                    )
                    .setFooter({
                        text:
                            `${client.config.botName} • Role Setup`
                    })
                    .setTimestamp()
            ]
        });

        await warning.react("✅");

        // ==================================================
        // CONFIRMATION
        // ==================================================

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
                embeds: [],
                components: []
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
                        name:
                            `${client.config.botName} • Role Setup`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Starting role setup...**`
                    )
                    .setTimestamp()
            ]
        });

        try {

            // ==================================================
            // DELETE EXISTING ROLES
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Removing existing custom roles...**`
            );

            const existingRoles = [...guild.roles.cache.values()]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .filter(role =>
                    role.position <
                    botMember.roles.highest.position
                )
                .sort(
                    (a, b) =>
                        b.position - a.position
                );

            let deleted = 0;

            for (const role of existingRoles) {

                try {

                    await role.delete(
                        "Role structure reset"
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
            // ROLE STRUCTURE
            // ==================================================
            //
            // IMPORTANT:
            // Discord role hierarchy is bottom → top.
            //
            // Therefore this array starts with the lowest
            // role and ends with the highest role.
            //
            // ==================================================

            const roles = [

                // ------------------------------------------
                // GENERAL
                // ------------------------------------------

                {
                    name: "Online Members",
                    color: 0,
                    hoist: false
                },

                {
                    name: "Member",
                    color: 0,
                    hoist: false
                },

                {
                    name: "Normal",
                    color: 0,
                    hoist: false
                },

                // ------------------------------------------
                // AGE
                // ------------------------------------------

                {
                    name: "18+",
                    color: 0,
                    hoist: false
                },

                // ------------------------------------------
                // PING ROLES
                // ------------------------------------------

                {
                    name: "Social Ping",
                    color: 0,
                    hoist: false
                },

                {
                    name: "YouTube Ping",
                    color: 0,
                    hoist: false
                },

                {
                    name: "Announcement Ping",
                    color: 0,
                    hoist: false
                },

                // ------------------------------------------
                // TICKET
                // ------------------------------------------

                {
                    name: "Ticket Moderator",
                    color: 0,
                    hoist: true
                },

                // ------------------------------------------
                // STAFF TEAM
                // ------------------------------------------

                {
                    name: "Staff Team",
                    color: 0,
                    hoist: true
                },

                {
                    name: "Executive Staff",
                    color: 0,
                    hoist: true
                },

                // ------------------------------------------
                // MODERATION
                // ------------------------------------------

                {
                    name: "Trial Moderator",
                    color: 0,
                    hoist: true
                },

                {
                    name: "Moderator",
                    color: 0,
                    hoist: true
                },

                {
                    name: "Head Moderator",
                    color: 0,
                    hoist: true
                },

                // ------------------------------------------
                // ADMINISTRATION
                // ------------------------------------------

                {
                    name: "Admin",
                    color: 0,
                    hoist: true
                },

                {
                    name: "Head Admin",
                    color: 0,
                    hoist: true
                },

                // ------------------------------------------
                // OWNER
                // ------------------------------------------

                {
                    name: "Owner",
                    color: 0,
                    hoist: true
                }
            ];

            // ==================================================
            // CREATE ROLES
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Creating ${roles.length} roles...**`
            );

            const createdRoles = [];

            for (const roleData of roles) {

                try {

                    const role = await guild.roles.create({

                        name: roleData.name,

                        color: roleData.color,

                        hoist: roleData.hoist,

                        mentionable: false,

                        permissions: "0",

                        reason:
                            "Server role structure setup"
                    });

                    createdRoles.push(role);

                } catch (error) {

                    console.log(
                        `Could not create role ${roleData.name}:`,
                        error.message
                    );
                }
            }

            // ==================================================
            // FIX ROLE POSITIONS
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Setting role hierarchy...**`
            );

            /*
             * createdRoles is already:
             *
             * Online Members
             * Member
             * Normal
             * ...
             * Owner
             *
             * We reverse it for Discord's position system.
             */

            const positions = [];

            for (
                let i = 0;
                i < createdRoles.length;
                i++
            ) {

                const role = createdRoles[i];

                positions.push({
                    role: role.id,
                    position: i + 1
                });
            }

            try {

                await guild.roles.setPositions({
                    positions
                });

            } catch (error) {

                console.log(
                    "Role position error:",
                    error.message
                );
            }

            // ==================================================
            // FINAL SORT
            // ==================================================

            await updateStatus(
                status,
                client,
                `${client.config.emojis.loading || "⏳"} **Finalizing role hierarchy...**`
            );

            // Fetch roles again
            await guild.roles.fetch();

            // ==================================================
            // SUCCESS
            // ==================================================

            return status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setAuthor({
                            name:
                                `${client.config.botName} • Role Setup Complete`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.success} **Role structure created successfully!**\n\n` +

                            `${client.config.emojis.role || "🎭"} **Roles Created**\n` +
                            `> ${createdRoles.length}\n\n` +

                            `${client.config.emojis.error || "🗑️"} **Roles Deleted**\n` +
                            `> ${deleted}\n\n` +

                            `${client.config.emojis.info || "ℹ️"} **Role Rules**\n` +
                            `> All roles use normal font\n` +
                            `> All created roles are non-mentionable\n` +
                            `> Managed roles were protected\n` +
                            `> @everyone was protected\n\n` +

                            `${client.config.emojis.success} **Hierarchy**\n` +
                            `> Owner\n` +
                            `> Head Admin\n` +
                            `> Admin\n` +
                            `> Head Moderator\n` +
                            `> Moderator\n` +
                            `> Trial Moderator\n` +
                            `> Executive Staff\n` +
                            `> Staff Team\n` +
                            `> Ticket Moderator\n` +
                            `> Announcement Ping\n` +
                            `> YouTube Ping\n` +
                            `> Social Ping\n` +
                            `> 18+\n` +
                            `> Normal\n` +
                            `> Member\n` +
                            `> Online Members`
                        )
                        .setFooter({
                            text:
                                `${client.config.botName} • Role Setup`
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
                        .setAuthor({
                            name:
                                `${client.config.botName} • Role Setup Failed`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.error} **Role setup failed.**\n\n` +
                            `**Reason:**\n` +
                            `> ${error.message || "Unknown error"}`
                        )
                        .setTimestamp()
                ]
            });
        }
    }
};


// ==========================================================
// STATUS UPDATE
// ==========================================================

async function updateStatus(
    message,
    client,
    text
) {

    try {

        await message.edit({
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
            ]
        });

    } catch {}
}