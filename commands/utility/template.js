const {
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    name: "template",
    aliases: [],
    description: "Check a Discord server template.",

    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Check a Discord server template.")
        .addStringOption(option =>
            option
                .setName("code")
                .setDescription("Discord server template code or URL")
                .setRequired(true)
        ),

    async execute(client, message, args) {

        const code = message?.options
            ? message.options.getString("code")
            : args[0];

        if (!code) {
            const reply = {
                content: `${client.config.emojis.error} Please provide a valid server template code or URL.`
            };

            if (message?.reply) {
                return message.reply(reply);
            }

            return interaction.reply(reply);
        }

        let templateCode = code.trim();

        const match = templateCode.match(
            /discord(?:app)?\.com\/template\/([a-zA-Z0-9-]+)/
        );

        if (match) {
            templateCode = match[1];
        }

        try {

            const template =
                await client.fetchGuildTemplate(templateCode);

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Server Template`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.success} **Template Found**
${client.config.emojis.server} **Name:** ${template.name}
${client.config.emojis.user} **Creator:** ${template.creator?.tag || "Unknown"}
${client.config.emojis.message} **Code:** \`${template.code}\`
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

            return message.reply({
                content: `${client.config.emojis.error} **Template doesn't exist.**`
            });

        }
    }
};