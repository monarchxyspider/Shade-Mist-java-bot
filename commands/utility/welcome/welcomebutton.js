const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");

module.exports = async function (client, interaction) {

    const guild = interaction.guild;

    if (!guild) {
        return interaction.reply({
            content: `${client.config.emojis.error} This button can only be used inside a server.`,
            ephemeral: true
        });
    }

    // ==================================================
    // CONFIG
    // ==================================================

    if (!client.welcomeConfigs) {
        client.welcomeConfigs = new Map();
    }

    let config =
        client.welcomeConfigs.get(guild.id);

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
    // PERMISSION
    // ==================================================

    if (
        !interaction.member.permissions.has(
            "ManageGuild"
        )
    ) {

        return interaction.reply({
            content:
                `${client.config.emojis.error} You need the **Manage Server** permission to manage the welcome system.`,
            ephemeral: true
        });
    }

    // ==================================================
    // ENABLE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_enable"
    ) {

        config.enabled = true;

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return updatePanel(
            client,
            interaction,
            config
        );
    }

    // ==================================================
    // DISABLE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_disable"
    ) {

        config.enabled = false;

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return updatePanel(
            client,
            interaction,
            config
        );
    }

    // ==================================================
    // CHANNEL
    // ==================================================

    if (
        interaction.customId ===
        "welcome_channel"
    ) {

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
${client.config.emojis.channel} **Select Welcome Channel**

Choose the channel where new member welcome messages should be sent.
`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome Configuration`
                })
                .setTimestamp();

        const menu =
            new ChannelSelectMenuBuilder()
                .setCustomId(
                    "welcome_channel_select"
                )
                .setPlaceholder(
                    "Select a welcome channel..."
                )
                .setChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setMinValues(1)
                .setMaxValues(1);

        const row =
            new ActionRowBuilder()
                .addComponents(menu);

        const backRow =
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
            components: [
                row,
                backRow
            ]
        });
    }

    // ==================================================
    // VARIABLES
    // ==================================================

    if (
        interaction.customId ===
        "welcome_variables"
    ) {

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
`
${client.config.emojis.message} **User Variables**

\`{user.mention}\` — Mention the member
\`{user.id}\` — Member ID
\`{user.name}\` — Display name
\`{user.username}\` — Username
\`{user.tag}\` — Username and tag
\`{user.avatar}\` — Avatar URL
\`{user.joinat}\` — Join date

${client.config.emojis.server} **Server Variables**

\`{guild.name}\` — Server name
\`{guild.id}\` — Server ID
\`{guild.members}\` — Member count
\`{guild.owner}\` — Server owner
\`{guild.icon}\` — Server icon URL

${client.config.emojis.time} **Other**

\`{timestamp}\` — Current Discord timestamp

These variables can be used inside your welcome embed and message.
`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Variables`
                })
                .setTimestamp();

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

    // ==================================================
    // HELP
    // ==================================================

    if (
        interaction.customId ===
        "welcome_help"
    ) {

        const embed =
            new EmbedBuilder()
                .setColor(
                    client.config.embedColor
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Welcome Help`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
`
${client.config.emojis.info} **Welcome System**

**Enable**
Turns the welcome system on.

**Disable**
Turns the welcome system off.

**Edit Embed**
Customize the welcome embed.

**Edit DM**
Customize the DM sent to new members.

**Test**
Send the current welcome configuration as a test.

**Channel**
Choose the channel where welcome messages are sent.

**Variables**
View all available welcome variables.
`
                )
                .setFooter({
                    text:
                        `${client.config.botName} • Welcome Help`
                })
                .setTimestamp();

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

    // ==================================================
    // RETURN TO MAIN
    // ==================================================

    if (
        interaction.customId ===
        "welcome_return_main"
    ) {

        return updatePanel(
            client,
            interaction,
            config
        );
    }

    // ==================================================
    // TEST
    // ==================================================

    if (
        interaction.customId ===
        "welcome_test"
    ) {

        if (!config.channelId) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Please set a welcome channel first.`,
                ephemeral: true
            });
        }

        const channel =
            guild.channels.cache.get(
                config.channelId
            );

        if (!channel) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} The configured welcome channel no longer exists.`,
                ephemeral: true
            });
        }

        try {

            const member =
                interaction.member;

            const replaceVariables =
                text => {

                    if (!text) return "";

                    return text
                        .replace(
                            /\{user\.mention\}/gi,
                            `<@${member.id}>`
                        )
                        .replace(
                            /\{user\.id\}/gi,
                            member.id
                        )
                        .replace(
                            /\{user\.name\}/gi,
                            member.user.displayName ||
                            member.user.username
                        )
                        .replace(
                            /\{user\.username\}/gi,
                            member.user.username
                        )
                        .replace(
                            /\{user\.tag\}/gi,
                            member.user.tag
                        )
                        .replace(
                            /\{guild\.name\}/gi,
                            guild.name
                        )
                        .replace(
                            /\{guild\.id\}/gi,
                            guild.id
                        )
                        .replace(
                            /\{guild\.members\}/gi,
                            guild.memberCount.toString()
                        )
                        .replace(
                            /\{guild\.owner\}/gi,
                            `<@${guild.ownerId}>`
                        )
                        .replace(
                            /\{timestamp\}/gi,
                            `<t:${Math.floor(
                                Date.now() / 1000
                            )}:F>`
                        );
                };

            let embed;

            if (config.embed) {

                const data =
                    config.embed;

                embed =
                    new EmbedBuilder();

                if (data.color)
                    embed.setColor(
                        data.color
                    );

                if (data.title)
                    embed.setTitle(
                        replaceVariables(
                            data.title
                        )
                    );

                if (data.description)
                    embed.setDescription(
                        replaceVariables(
                            data.description
                        )
                    );

                if (data.url)
                    embed.setURL(
                        replaceVariables(
                            data.url
                        )
                    );

                if (
                    data.author &&
                    data.author.name
                ) {

                    embed.setAuthor({
                        name:
                            replaceVariables(
                                data.author.name
                            ),

                        url:
                            data.author.url
                                ? replaceVariables(
                                    data.author.url
                                )
                                : undefined,

                        iconURL:
                            data.author.iconURL
                                ? replaceVariables(
                                    data.author.iconURL
                                )
                                : undefined
                    });
                }

                if (data.thumbnail)
                    embed.setThumbnail(
                        replaceVariables(
                            data.thumbnail
                        )
                    );

                if (data.image)
                    embed.setImage(
                        replaceVariables(
                            data.image
                        )
                    );

                if (data.footer?.text) {

                    embed.setFooter({
                        text:
                            replaceVariables(
                                data.footer.text
                            ),

                        iconURL:
                            data.footer.iconURL
                                ? replaceVariables(
                                    data.footer.iconURL
                                )
                                : undefined
                    });
                }

                if (data.timestamp)
                    embed.setTimestamp();
            }

            const content =
                replaceVariables(
                    config.message
                );

            await channel.send({
                content:
                    content || undefined,

                embeds:
                    embed
                        ? [embed]
                        : []
            });

            return interaction.reply({
                content:
                    `${client.config.emojis.success} Test welcome message sent successfully.`,
                ephemeral: true
            });

        } catch (error) {

            console.error(
                "Welcome Test Error:",
                error
            );

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Failed to send the test welcome message.`,
                ephemeral: true
            });
        }
    }

    // ==================================================
    // EDIT EMBED
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_embed"
    ) {

        const embed =
            new EmbedBuilder()
                .setColor(
                    config.embed?.color ||
                    client.config.embedColor
                )
                .setAuthor({
                    name:
                        `${client.config.botName} • Edit Welcome Embed`,
                    iconURL:
                        client.user.displayAvatarURL()
                })
                .setDescription(
`
${client.config.emojis.message} **Welcome Embed Editor**

Choose what you want to edit below.
`
                );

        const row1 =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_author"
                        )
                        .setLabel(
                            "Edit Author"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_text"
                        )
                        .setLabel(
                            "Edit Text"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_title"
                        )
                        .setLabel(
                            "Edit Title"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        const row2 =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_description"
                        )
                        .setLabel(
                            "Edit Description"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_thumbnail"
                        )
                        .setLabel(
                            "Edit Thumbnail"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_image"
                        )
                        .setLabel(
                            "Edit Image"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        const row3 =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_random_color"
                        )
                        .setLabel(
                            "Random Colour"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_edit_color"
                        )
                        .setLabel(
                            "Edit Embed Colour"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            "welcome_return_main"
                        )
                        .setLabel(
                            "Return to Main"
                        )
                        .setStyle(
                            ButtonStyle.Danger
                        )
                );

        return interaction.update({
            embeds: [embed],
            components: [
                row1,
                row2,
                row3
            ]
        });
    }

    // ==================================================
    // EDIT DM
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_dm"
    ) {

        return interaction.reply({
            content:
                `${client.config.emojis.info} DM editor will be added in the next part.`,
            ephemeral: true
        });
    }
};


// ==========================================================
// UPDATE MAIN PANEL
// ==========================================================

async function updatePanel(
    client,
    interaction,
    config
) {

    const status =
        config.enabled
            ? "Enabled"
            : "Disabled";

    const statusEmoji =
        config.enabled
            ? client.config.emojis.success
            : client.config.emojis.error;

    const channel =
        config.channelId
            ? `<#${config.channelId}>`
            : "Not Set";

    const embed =
        new EmbedBuilder()
            .setColor(
                config.enabled
                    ? client.config.embedColor
                    : 0x2b2d31
            )
            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setDescription(
`
${statusEmoji} **Status:** ${status}
${client.config.emojis.channel} **Channel:** ${channel}

${client.config.emojis.message} **Welcome System**

Configure your server's welcome message, embed, DM message and welcome channel using the buttons below.
`
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome Configuration`,
                iconURL:
                    client.user.displayAvatarURL()
            })
            .setTimestamp();

    const row1 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        config.enabled
                            ? "welcome_disable"
                            : "welcome_enable"
                    )
                    .setLabel(
                        config.enabled
                            ? "Disable"
                            : "Enable"
                    )
                    .setStyle(
                        config.enabled
                            ? ButtonStyle.Danger
                            : ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_embed"
                    )
                    .setLabel("Edit Embed")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_dm"
                    )
                    .setLabel("Edit DM")
                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_test"
                    )
                    .setLabel("Test")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_channel"
                    )
                    .setLabel("Channel")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_variables"
                    )
                    .setLabel("Variables")
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_help"
                    )
                    .setLabel("Help")
                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );

    return interaction.update({
        embeds: [embed],
        components: [
            row1,
            row2
        ]
    });
}