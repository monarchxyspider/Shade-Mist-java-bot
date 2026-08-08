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
        // USER PERMISSION
        // ==================================================

        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need the **Manage Server** permission to use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        const botMember = message.guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(PermissionFlagsBits.ManageGuild)
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

            const template = await message.guild.createTemplate(
                `${message.guild.name} Template`,
                `Official server template for ${message.guild.name}.`
            );

            // ==================================================
            // SUCCESS EMBED
            // ==================================================

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Server Template`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(
                    `${client.config.emojis.success} **Server Template Created**\n\n` +

                    `${client.config.emojis.server} **Server**\n` +
                    `> ${message.guild.name}\n\n` +

                    `${client.config.emojis.message} **Template Code**\n` +
                    `> \`${template.code}\`\n\n` +

                    `${client.config.emojis.info} **Template Link**\n` +
                    `> ${template.url}`
                )
                .setFooter({
                    text: `${client.config.botName} • Server Template`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (error) {

            console.error(
                "Server Template Error:",
                error
            );

            return message.reply({
                content:
                    `${client.config.emojis.error} **Failed to create the server template.**\n` +
                    `Please make sure the bot has the required permissions.`
            });
        }
    }
};