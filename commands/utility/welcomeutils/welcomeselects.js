const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");

module.exports = async (client, interaction) => {

    const id =
        interaction.customId;

    // ==================================================
    // WELCOME CHANNEL SELECT
    // ==================================================

    if (
        id === "welcome_channel_select"
    ) {

        const channelId =
            interaction.values[0];

        if (!client.welcomeConfigs) {
            client.welcomeConfigs =
                new Map();
        }

        const config =
            client.welcomeConfigs.get(
                interaction.guild.id
            ) || {};

        config.channelId =
            channelId;

        client.welcomeConfigs.set(
            interaction.guild.id,
            config
        );

        const channel =
            interaction.guild.channels.cache.get(
                channelId
            );

        return interaction.update({

            embeds: [
                new EmbedBuilder()
                    .setColor(
                        client.config.embedColor
                    )
                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome Channel`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success || "✅"} **Welcome channel updated!**\n\n` +
                        `Messages will now be sent to ${channel || "the selected channel"}.`
                    )
                    .setTimestamp()
            ],

            components: [

                new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId(
                                "welcome_return"
                            )
                            .setLabel(
                                "Return"
                            )
                            .setEmoji(
                                "↩️"
                            )
                            .setStyle(
                                ButtonStyle.Danger
                            )
                    )
            ]
        });
    }

    // ==================================================
    // UNKNOWN SELECT
    // ==================================================

    return;
};