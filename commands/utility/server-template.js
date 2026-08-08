const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "server-template",
    aliases: ["servertemplate"],
    description: "Create a Discord server template.",

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
        // USER PERMISSION
        // ==================================================

        if (
            !member ||
            !member.permissions.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need the **Manage Server** permission to use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need the **Manage Server** permission to create a server template.`
            });
        }

        // ==================================================
        // CREATE TEMPLATE
        // ==================================================

        try {

            const template = await guild.createTemplate(
                `${guild.name} Template`,
                `Official server template for ${guild.name}.`
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
                    `> \`${template.code}\`\n\n` +

                    `${client.config.emojis.info} **Template Link**\n` +
                    `> ${template.url}`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Server Template`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (error) {

            // ==================================================
            // CONSOLE ERROR
            // ==================================================

            console.error(
                "========================================"
            );

            console.error(
                "SERVER TEMPLATE ERROR"
            );

            console.error(
                "Error Code:",
                error.code
            );

            console.error(
                "HTTP Status:",
                error.status
            );

            console.error(
                "Error Name:",
                error.name
            );

            console.error(
                "Error Message:",
                error.message
            );

            console.error(
                "Full Error:",
                error
            );

            console.error(
                "========================================"
            );

            // ==================================================
            // ERROR MESSAGE
            // ==================================================

            let reason =
                error.message ||
                "Unknown Discord API error.";

            if (error.code === 50013) {

                reason =
                    "The bot does not have the required permissions.";

            } else if (error.code === 50001) {

                reason =
                    "The bot does not have access to this server.";

            } else if (error.code === 50035) {

                reason =
                    "Discord rejected the template data.";

            } else if (
                error.message &&
                error.message.toLowerCase().includes(
                    "permission"
                )
            ) {

                reason =
                    "Discord rejected the request because of a permission issue.";

            } else if (
                error.message &&
                error.message.toLowerCase().includes(
                    "template"
                )
            ) {

                reason =
                    error.message;

            }

            // ==================================================
            // SEND ERROR
            // ==================================================

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setAuthor({
                            name:
                                `${client.config.botName} • Template Error`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.error} **Failed to create the server template.**\n\n` +

                            `${client.config.emojis.info} **Reason**\n` +
                            `> ${reason}\n\n` +

                            `**Error Code:** \`${error.code || "Unknown"}\``
                        )
                        .setFooter({
                            text:
                                `${client.config.botName} • Discord API`
                        })
                        .setTimestamp()
                ]
            });
        }
    }
};