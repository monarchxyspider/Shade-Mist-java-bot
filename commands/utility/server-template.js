const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "server-template",
    aliases: ["servertemplate"],
    description: "Create or update the Discord server template.",

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
                    `${client.config.emojis.error} I need the **Manage Server** permission to manage the server template.`
            });
        }

        // ==================================================
        // GET EXISTING TEMPLATE
        // ==================================================

        try {

            const templates =
                await guild.fetchTemplates();

            let template;

            // Server can only have one template
            if (templates.size > 0) {

                template = templates.first();

                // ==================================================
                // UPDATE EXISTING TEMPLATE
                // ==================================================

                try {

                    template = await template.edit({
                        name: `${guild.name} Template`,
                        description:
                            `Official server template for ${guild.name}.`
                    });

                } catch (error) {

                    console.error(
                        "Template Update Error:",
                        error
                    );

                    return message.reply({
                        content:
                            `${client.config.emojis.error} **Failed to update the existing server template.**\n\n` +
                            `**Discord Error:** \`${error.message || "Unknown error"}\``
                    });
                }

            } else {

                // ==================================================
                // CREATE NEW TEMPLATE
                // ==================================================

                template = await guild.createTemplate(
                    `${guild.name} Template`,
                    `Official server template for ${guild.name}.`
                );
            }

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
                    `${client.config.emojis.success} **Server Template Ready**\n\n` +

                    `${client.config.emojis.server} **Server**\n` +
                    `> ${guild.name}\n\n` +

                    `${client.config.emojis.message} **Template Code**\n` +
                    `> \`${template.code}\`\n\n` +

                    `${client.config.emojis.info} **Template Link**\n` +
                    `> ${template.url}\n\n` +

                    `${client.config.emojis.success} **Status**\n` +
                    `> ${templates.size > 0 ? "Updated existing template" : "Created new template"}`
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
            // ERROR LOG
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
            // ERROR RESPONSE
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
                            `${client.config.emojis.error} **Failed to create/update the server template.**\n\n` +

                            `${client.config.emojis.info} **Reason**\n` +
                            `> ${error.message || "Unknown Discord error."}\n\n` +

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