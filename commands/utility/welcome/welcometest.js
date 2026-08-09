const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig,
    getWelcomeChannel
} = require("../../utils/welcomeManager");

const {
    replaceVariables
} = require("../../utils/welcomeVariables");

module.exports = {
    name: "welcome-test",
    aliases: ["welcometest"],
    description: "Send a test welcome message.",

    async execute(client, message) {

        if (!message.guild) return;

        if (
            !message.member.permissions.has("ManageGuild")
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Server** permission.`
            });
        }

        const config =
            getConfig(message.guild.id);

        const channel =
            getWelcomeChannel(message.guild);

        if (!channel) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please set a welcome channel first using \`s!welcome channel\`.`
            });
        }

        const description =
            replaceVariables(
                config.embed?.description ||
                config.message ||
                "Welcome {user.mention} to {guild.name}!",
                message.member
            );

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.embed?.color ||
                    client.config.embedColor
                );

        if (config.embed?.title) {
            embed.setTitle(
                replaceVariables(
                    config.embed.title,
                    message.member
                )
            );
        }

        if (config.embed?.description) {
            embed.setDescription(
                description
            );
        }

        if (config.embed?.author?.name) {
            embed.setAuthor({
                name:
                    replaceVariables(
                        config.embed.author.name,
                        message.member
                    ),
                url:
                    config.embed.author.url ||
                    undefined,
                iconURL:
                    config.embed.author.iconURL ||
                    undefined
            });
        }

        if (config.embed?.thumbnail) {
            embed.setThumbnail(
                replaceVariables(
                    config.embed.thumbnail,
                    message.member
                )
            );
        }

        if (config.embed?.image) {
            embed.setImage(
                replaceVariables(
                    config.embed.image,
                    message.member
                )
            );
        }

        if (config.embed?.timestamp) {
            embed.setTimestamp();
        }

        const content =
            replaceVariables(
                config.message || "",
                message.member
            );

        await channel.send({
            content: content || undefined,
            embeds: [embed]
        });

        return message.reply({
            content:
                `${client.config.emojis.success || "✅"} **Test welcome message sent to ${channel}.**`
        });
    }
};