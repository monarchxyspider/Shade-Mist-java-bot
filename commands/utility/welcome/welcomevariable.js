const {
    EmbedBuilder
} = require("discord.js");

const {
    getVariableList
} = require("../../utils/welcomeVariables");

module.exports = {
    name: "welcome-variables",
    aliases: ["welcomevariables", "welcomervars"],
    description: "Show all available welcome variables.",

    async execute(client, message) {

        if (!message.guild) {
            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        const variables =
            getVariableList();

        const userVariables = variables.filter(
            variable =>
                variable.startsWith("{user.")
        );

        const guildVariables = variables.filter(
            variable =>
                variable.startsWith("{guild.")
        );

        const timestampVariables = variables.filter(
            variable =>
                variable.startsWith("{timestamp")
        );

        const embed =
            new EmbedBuilder()
                .setColor(
                    client.config.embedColor
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Welcome Variables`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
                    `Use these variables inside your welcome message, embed, DM message, author, title, description, etc.`
                )
                .addFields(
                    {
                        name: "👤 User Variables",
                        value:
                            userVariables
                                .map(
                                    variable =>
                                        `\`${variable}\``
                                )
                                .join("\n")
                    },
                    {
                        name: "🏠 Server Variables",
                        value:
                            guildVariables
                                .map(
                                    variable =>
                                        `\`${variable}\``
                                )
                                .join("\n")
                    },
                    {
                        name: "🕐 Time Variables",
                        value:
                            timestampVariables
                                .map(
                                    variable =>
                                        `\`${variable}\``
                                )
                                .join("\n")
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