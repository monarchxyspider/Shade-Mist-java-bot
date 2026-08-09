const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig
} = require("../../utils/welcomeManager");

module.exports = {
    name: "welcome-embed",
    aliases: ["welcomeembed"],
    description: "Show the current welcome embed settings.",

    async execute(client, message) {

        if (!message.guild) return;

        if (!message.member.permissions.has("ManageGuild")) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission.`
            });
        }

        const config = getConfig(message.guild.id);
        const embedConfig = config.embed || {};

        const embed = new EmbedBuilder()
            .setColor(
                embedConfig.color ||
                client.config.embedColor
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Embed`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTitle(
                embedConfig.title ||
                "Welcome!"
            )
            .setDescription(
                embedConfig.description ||
                "Welcome {user.mention} to **{guild.name}**!"
            );

        if (embedConfig.author?.name) {
            embed.setAuthor({
                name: embedConfig.author.name,
                url:
                    embedConfig.author.url ||
                    undefined,
                iconURL:
                    embedConfig.author.iconURL ||
                    undefined
            });
        }

        if (embedConfig.thumbnail) {
            embed.setThumbnail(
                embedConfig.thumbnail
            );
        }

        if (embedConfig.image) {
            embed.setImage(
                embedConfig.image
            );
        }

        if (embedConfig.footer?.text) {
            embed.setFooter({
                text:
                    embedConfig.footer.text,
                iconURL:
                    embedConfig.footer.iconURL ||
                    undefined
            });
        }

        if (embedConfig.timestamp) {
            embed.setTimestamp();
        }

        return message.reply({
            embeds: [embed]
        });
    }
};