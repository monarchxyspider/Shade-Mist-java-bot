const {
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "welcome-help",
    aliases: ["welcomehelp"],
    description: "Show welcome system help.",

    async execute(client, message) {

        if (!message.guild) return;

        const embed =
            new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name:
                        `${client.config.botName} • Welcome Help`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
                    `Configure the complete welcome system using these commands and the setup panel.`
                )
                .addFields(
                    {
                        name: "Main Commands",
                        value:
                            "`s!welcome` — Open welcome control panel\n" +
                            "`s!welcome config` — View configuration\n" +
                            "`s!welcome enable` — Enable system\n" +
                            "`s!welcome disable` — Disable system\n" +
                            "`s!welcome test` — Send a test message\n" +
                            "`s!welcome channel` — Set welcome channel\n" +
                            "`s!welcome variables` — View variables\n" +
                            "`s!welcome help` — Show this help"
                    },
                    {
                        name: "Variables",
                        value:
                            "`{user.mention}`\n" +
                            "`{user.id}`\n" +
                            "`{user.name}`\n" +
                            "`{user.username}`\n" +
                            "`{user.avatar}`\n" +
                            "`{user.joinat}`\n" +
                            "`{guild.name}`\n" +
                            "`{guild.id}`\n" +
                            "`{guild.members}`\n" +
                            "`{guild.owner}`\n" +
                            "`{guild.icon}`\n" +
                            "`{timestamp}`"
                    },
                    {
                        name: "Permissions",
                        value:
                            `Most configuration commands require **Manage Server** permission.`
                    }
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome System`
                })
                .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};