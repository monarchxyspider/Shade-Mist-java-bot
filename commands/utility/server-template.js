const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "server-template",
    aliases: ["servertemplate"],
    description: "Create a Discord server template.",

    async execute(client, message) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply({
                content: `${client.config.emojis.error} You need the **Manage Server** permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply({
                content: `${client.config.emojis.error} I need the **Manage Server** permission to create a server template.`
            });
        }

        try {

            const template = await message.guild.createTemplate(
                `${message.guild.name} Template`,
                `Official server template for ${message.guild.name}.`
            );

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Server Template`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.success} **Server Template Created**

${client.config.emojis.server} **Server**
${message.guild.name}

${client.config.emojis.message} **Template**
\`${template.code}\`

${client.config.emojis.info} **Template Link**
${template.url}
`)
                .setFooter({
                    text: client.config.botName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        } catch (error) {

            console.error("Server Template Error:", error);

            return message.reply({
                content: `${client.config.emojis.error} Failed to create the server template.`
            });

        }
    }
};