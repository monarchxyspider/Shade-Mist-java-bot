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
        // BASIC CHECK
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
            !member.permissions.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need the **Manage Server** permission to create a server template.`
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

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            console.error(
                "SERVER TEMPLATE ERROR"
            );

            console.error(
                "Code:",
                error.code
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Name:",
                error.name
            );

            console.error(
                "Status:",
                error.status
            );

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            // ==================================================
            // SPECIFIC DISCORD ERRORS
            // ==================================================

            let errorMessage =
                `${client.config.emojis.error} **Failed to create the server template.**`;

            if (error.code === 50013) {

                errorMessage +=
                    `\n\nI don't have the required permission to perform this action.`;

            } else if (error.code === 50001) {

                errorMessage +=
                    `\n\nI don't have access to this server.`;

            } else if (error.code === 40060) {

                errorMessage +=
                    `\n\nThe request was already acknowledged.`;

            } else if (
                error.message &&
                error.message.toLowerCase().includes("template")
            ) {

                errorMessage +=
                    `\n\nDiscord rejected the template request.`;

            } else {

                errorMessage +=
                    `\n\n**Discord Error:** \`${error.message || "Unknown error"}\``;
            }

            return message.reply({
                content: errorMessage
            });
        }
    }
};