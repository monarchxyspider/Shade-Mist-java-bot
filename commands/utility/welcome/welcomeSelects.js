const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async function (client, interaction) {

    // ==================================================
    // BASIC CHECK
    // ==================================================

    if (!interaction.guild) {
        return interaction.reply({
            content:
                `${client.config.emojis.error} This can only be used inside a server.`,
            ephemeral: true
        });
    }

    const guild = interaction.guild;

    // ==================================================
    // PERMISSION
    // ==================================================

    if (!interaction.member.permissions.has("ManageGuild")) {

        return interaction.reply({
            content:
                `${client.config.emojis.error} You need the **Manage Server** permission.`,
            ephemeral: true
        });

    }

    // ==================================================
    // CONFIG MAP
    // ==================================================

    if (!client.welcomeConfigs) {
        client.welcomeConfigs = new Map();
    }

    let config =
        client.welcomeConfigs.get(guild.id);

    // ==================================================
    // DEFAULT CONFIG
    // ==================================================

    if (!config) {

        config = {
            enabled: false,
            channelId: null,

            message: "",

            embed: {
                color: client.config.embedColor,
                title: "",
                description: "",
                url: "",

                author: {
                    name: "",
                    url: "",
                    iconURL: ""
                },

                thumbnail: "",
                image: "",

                footer: {
                    text: "",
                    iconURL: ""
                },

                timestamp: true
            },

            buttons: [],

            dmEnabled: false,
            dmMessage: ""
        };

        client.welcomeConfigs.set(
            guild.id,
            config
        );
    }

    // ==================================================
    // CHANNEL SELECT
    // ==================================================

    if (
        interaction.customId ===
        "welcome_channel_select"
    ) {

        const channelId =
            interaction.values?.[0];

        if (!channelId) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Please select a channel.`,
                ephemeral: true
            });
        }

        const channel =
            guild.channels.cache.get(
                channelId
            );

        if (!channel) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} I couldn't find that channel.`,
                ephemeral: true
            });
        }

        // ==================================================
        // CHECK SEND PERMISSION
        // ==================================================

        const botPermissions =
            channel.permissionsFor(
                guild.members.me
            );

        if (
            !botPermissions?.has("ViewChannel") ||
            !botPermissions?.has("SendMessages")
        ) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} I don't have permission to send messages in ${channel}.`,
                ephemeral: true
            });
        }

        // ==================================================
        // SAVE CHANNEL
        // ==================================================

        config.channelId =
            channel.id;

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        // ==================================================
        // CONFIRMATION EMBED
        // ==================================================

        const embed =
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
`
${client.config.emojis.success} **Welcome Channel Updated**

${client.config.emojis.channel} **Channel**
${channel}

The welcome system will now send new member messages in this channel.
`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome Configuration`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setTimestamp();

        // ==================================================
        // RETURN BUTTON
        // ==================================================

        const row =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_return_main"
                        )
                        .setLabel(
                            "Return to Main"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
};