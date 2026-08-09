const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");

const {
    getConfig,
    saveConfig
} = require("./welcomeManager");

module.exports = async (client, interaction) => {

    const id = interaction.customId;
    const guildId = interaction.guild.id;

    // ==================================================
    // GET CONFIG
    // ==================================================

    let config = getConfig(guildId);

    // ==================================================
    // ENABLE
    // ==================================================

    if (id === "welcome_enable") {

        config.enabled = true;

        saveConfig(
            guildId,
            config
        );

        return interaction.update({
            embeds: [
                createMainEmbed(
                    client,
                    interaction,
                    config
                )
            ],
            components: [
                createMainButtons(
                    config.enabled
                )
            ]
        });
    }


    // ==================================================
    // DISABLE
    // ==================================================

    if (id === "welcome_disable") {

        config.enabled = false;

        saveConfig(
            guildId,
            config
        );

        return interaction.update({
            embeds: [
                createMainEmbed(
                    client,
                    interaction,
                    config
                )
            ],
            components: [
                createMainButtons(
                    config.enabled
                )
            ]
        });
    }


    // ==================================================
    // CHANNEL
    // ==================================================

    if (id === "welcome_channel") {

        const channelMenu =
            new ChannelSelectMenuBuilder()
                .setCustomId(
                    "welcome_channel_select"
                )
                .setPlaceholder(
                    "Select welcome channel"
                )
                .setChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setMinValues(1)
                .setMaxValues(1);

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
                        `${client.config.emojis.info || "ℹ️"} **Select Welcome Channel**\n\n` +
                        `Choose the channel where welcome messages should be sent.`
                    )
                    .setTimestamp()
            ],

            components: [

                new ActionRowBuilder()
                    .addComponents(
                        channelMenu
                    ),

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
    // EDIT EMBED
    // ==================================================

    if (id === "welcome_edit_embed") {

        return interaction.update({

            embeds: [
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
                        `${client.config.emojis.info || "ℹ️"} **Welcome Embed Editor**\n\n` +
                        `Choose what you want to edit below.`
                    )
                    .setTimestamp()
            ],

            components: [

                new ActionRowBuilder()
                    .addComponents(

                        button(
                            "welcome_edit_author",
                            "Edit Author",
                            ButtonStyle.Primary
                        ),

                        button(
                            "welcome_edit_description",
                            "Edit Description",
                            ButtonStyle.Primary
                        ),

                        button(
                            "welcome_edit_title",
                            "Edit Title",
                            ButtonStyle.Primary
                        ),

                        button(
                            "welcome_edit_thumbnail",
                            "Edit Thumbnail",
                            ButtonStyle.Secondary
                        ),

                        button(
                            "welcome_edit_image",
                            "Edit Image",
                            ButtonStyle.Secondary
                        )
                    ),

                new ActionRowBuilder()
                    .addComponents(

                        button(
                            "welcome_embed_colour",
                            "Embed Colour",
                            ButtonStyle.Secondary
                        ),

                        button(
                            "welcome_random_embed",
                            "Random Embed",
                            ButtonStyle.Secondary
                        ),

                        button(
                            "welcome_add_button",
                            "Add Button",
                            ButtonStyle.Success
                        ),

                        button(
                            "welcome_return",
                            "Return",
                            ButtonStyle.Danger
                        )
                    )
            ]
        });
    }


    // ==================================================
    // EDIT AUTHOR
    // ==================================================

    if (id === "welcome_edit_author") {

        return interaction.showModal(

            createModal(
                "welcome_modal_author",
                "Edit Author",
                [

                    [
                        "author_name",
                        "Author Name",
                        "Welcome!",
                        TextInputStyle.Short
                    ],

                    [
                        "author_url",
                        "Author URL",
                        "https://example.com",
                        TextInputStyle.Short
                    ],

                    [
                        "author_icon",
                        "Author Icon URL",
                        "https://example.com/icon.png",
                        TextInputStyle.Short
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EDIT DESCRIPTION
    // ==================================================

    if (id === "welcome_edit_description") {

        return interaction.showModal(

            createModal(
                "welcome_modal_description",
                "Edit Description",
                [

                    [
                        "description",
                        "Description",
                        "Welcome {user.mention} to {guild.name}!",
                        TextInputStyle.Paragraph
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EDIT TITLE
    // ==================================================

    if (id === "welcome_edit_title") {

        return interaction.showModal(

            createModal(
                "welcome_modal_title",
                "Edit Title",
                [

                    [
                        "title",
                        "Embed Title",
                        "Welcome to {guild.name}!",
                        TextInputStyle.Short
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EDIT THUMBAIL
    // ==================================================

    if (id === "welcome_edit_thumbnail") {

        return interaction.showModal(

            createModal(
                "welcome_modal_thumbnail",
                "Edit Thumbnail",
                [

                    [
                        "thumbnail",
                        "Thumbnail URL",
                        "https://example.com/image.png",
                        TextInputStyle.Short
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EDIT IMAGE
    // ==================================================

    if (id === "welcome_edit_image") {

        return interaction.showModal(

            createModal(
                "welcome_modal_image",
                "Edit Image",
                [

                    [
                        "image",
                        "Image URL",
                        "https://example.com/image.png",
                        TextInputStyle.Short
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EMBED COLOUR
    // ==================================================

    if (id === "welcome_embed_colour") {

        return interaction.showModal(

            createModal(
                "welcome_modal_colour",
                "Embed Colour",
                [

                    [
                        "colour",
                        "HEX Colour",
                        "#5865F2",
                        TextInputStyle.Short
                    ]

                ]
            )
        );
    }


    // ==================================================
    // RANDOM EMBED
    // ==================================================

    if (id === "welcome_random_embed") {

        const colours = [

            "#5865F2",
            "#57F287",
            "#FEE75C",
            "#EB459E",
            "#ED4245",
            "#00A8FC",
            "#9B59B6",
            "#E67E22",
            "#1ABC9C"

        ];

        const colour =
            colours[
                Math.floor(
                    Math.random() *
                    colours.length
                )
            ];

        config.embed =
            config.embed || {};

        config.embed.color =
            colour;

        saveConfig(
            guildId,
            config
        );

        return interaction.update({

            embeds: [

                new EmbedBuilder()
                    .setColor(colour)
                    .setTitle(
                        "Random Embed Colour"
                    )
                    .setDescription(
                        `${client.config.emojis.success || "✅"} **Random colour selected!**\n\n` +
                        `**Colour:** \`${colour}\``
                    )

            ],

            components: [

                new ActionRowBuilder()
                    .addComponents(

                        button(
                            "welcome_return",
                            "Return",
                            ButtonStyle.Danger
                        )

                    )

            ]
        });
    }


    // ==================================================
    // ADD BUTTON
    // ==================================================

    if (id === "welcome_add_button") {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_add_button"
                )
                .setTitle(
                    "Add Welcome Button"
                );

        modal.addComponents(

            input(
                "button_label",
                "Button Name",
                "Rules"
            ),

            input(
                "button_emoji",
                "Button Emoji",
                "📜",
                false
            ),

            input(
                "button_colour",
                "Button Colour",
                "Blue / Green / Red / Grey"
            ),

            input(
                "button_url",
                "Button URL",
                "https://example.com",
                false
            ),

            input(
                "button_id",
                "Button ID",
                "welcome_rules",
                false
            )

        );

        return interaction.showModal(
            modal
        );
    }


    // ==================================================
    // EDIT TEXT
    // ==================================================

    if (id === "welcome_edit_text") {

        return interaction.showModal(

            createModal(
                "welcome_modal_text",
                "Edit Welcome Text",
                [

                    [
                        "message",
                        "Welcome Message",
                        "Welcome {user.mention} to {guild.name}!",
                        TextInputStyle.Paragraph
                    ]

                ]
            )
        );
    }


    // ==================================================
    // EDIT DM
    // ==================================================

    if (id === "welcome_edit_dm") {

        return interaction.showModal(

            createModal(
                "welcome_modal_dm",
                "Edit DM Message",
                [

                    [
                        "dm_message",
                        "DM Message",
                        "Welcome to {guild.name}!",
                        TextInputStyle.Paragraph
                    ]

                ]
            )
        );
    }


    // ==================================================
    // VARIABLES
    // ==================================================

    if (id === "welcome_variables") {

        return interaction.update({

            embeds: [

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

                        [
                            "**User Variables**",

                            "`{user.mention}` — Mention",
                            "`{user.id}` — User ID",
                            "`{user.name}` — Username",
                            "`{user.username}` — Username",
                            "`{user.tag}` — User Tag",
                            "`{user.avatar}` — Avatar URL",
                            "`{user.joinat}` — Join date",
                            "`{user.createdat}` — Account creation",

                            "",

                            "**Guild Variables**",

                            "`{guild.name}` — Server name",
                            "`{guild.id}` — Server ID",
                            "`{guild.members}` — Member count",
                            "`{guild.owner}` — Server owner",
                            "`{guild.icon}` — Server icon",

                            "",

                            "**General**",

                            "`{timestamp}` — Relative timestamp",
                            "`{timestamp.full}` — Discord timestamp"

                        ].join("\n")
                    )
                    .setTimestamp()

            ],

            components: [

                new ActionRowBuilder()
                    .addComponents(

                        button(
                            "welcome_return",
                            "Return",
                            ButtonStyle.Danger
                        )

                    )

            ]
        });
    }


    // ==================================================
    // TEST
    // ==================================================

    if (id === "welcome_test") {

        config = getConfig(guildId);

        if (!config.enabled) {

            return interaction.reply({

                content:
                    `${client.config.emojis.error} Welcome system is currently **disabled**.`,

                ephemeral: true

            });
        }

        if (!config.channelId) {

            return interaction.reply({

                content:
                    `${client.config.emojis.error} Please set a welcome channel first.`,

                ephemeral: true

            });
        }

        const channel =
            interaction.guild.channels.cache.get(
                config.channelId
            );

        if (!channel) {

            return interaction.reply({

                content:
                    `${client.config.emojis.error} The configured welcome channel no longer exists.`,

                ephemeral: true

            });
        }

        return interaction.reply({

            content:
                `${client.config.emojis.success || "✅"} Test message will be sent using your saved welcome configuration.`,

            ephemeral: true

        });
    }


    // ==================================================
    // RETURN
    // ==================================================

    if (id === "welcome_return") {

        config =
            getConfig(guildId);

        return interaction.update({

            embeds: [

                createMainEmbed(
                    client,
                    interaction,
                    config
                )

            ],

            components: [

                createMainButtons(
                    config.enabled
                )

            ]
        });
    }
};


// ==========================================================
// MAIN EMBED
// ==========================================================

function createMainEmbed(
    client,
    interaction,
    config
) {

    const enabled =
        Boolean(config.enabled);

    const channel =
        config.channelId
            ? `<#${config.channelId}>`
            : "`Not configured`";

    return new EmbedBuilder()

        .setColor(
            enabled
                ? 0x57F287
                : 0xED4245
        )

        .setAuthor({
            name:
                `${client.config.botName} • Welcome System`,
            iconURL:
                client.user.displayAvatarURL()
        })

        .setDescription(

            `${enabled ? "🟢" : "🔴"} **Welcome System:** ${enabled ? "Enabled" : "Disabled"}\n\n` +

            `📢 **Channel:** ${channel}\n` +

            `✉️ **DM:** ${
                config.dmEnabled
                    ? "Enabled"
                    : "Disabled"
            }\n\n` +

            `Configure your server welcome system using the buttons below.`

        )

        .setTimestamp();
}


// ==========================================================
// MAIN BUTTONS
// ==========================================================

function createMainButtons(
    enabled
) {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_enable"
                    )
                    .setLabel(
                        "Enable"
                    )
                    .setEmoji(
                        "🟢"
                    )
                    .setStyle(
                        enabled
                            ? ButtonStyle.Success
                            : ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_disable"
                    )
                    .setLabel(
                        "Disable"
                    )
                    .setEmoji(
                        "🔴"
                    )
                    .setStyle(
                        ButtonStyle.Danger
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_embed"
                    )
                    .setLabel(
                        "Edit Embed"
                    )
                    .setEmoji(
                        "📝"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_text"
                    )
                    .setLabel(
                        "Edit Text"
                    )
                    .setEmoji(
                        "💬"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_dm"
                    )
                    .setLabel(
                        "Edit DM"
                    )
                    .setEmoji(
                        "✉️"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    )

            ),

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_channel"
                    )
                    .setLabel(
                        "Channel"
                    )
                    .setEmoji(
                        "📢"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_variables"
                    )
                    .setLabel(
                        "Variables"
                    )
                    .setEmoji(
                        "🔤"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_test"
                    )
                    .setLabel(
                        "Test"
                    )
                    .setEmoji(
                        "🧪"
                    )
                    .setStyle(
                        ButtonStyle.Success
                    )

            )

    ];
}


// ==========================================================
// BUTTON HELPER
// ==========================================================

function button(
    customId,
    label,
    style
) {

    return new ButtonBuilder()

        .setCustomId(
            customId
        )

        .setLabel(
            label
        )

        .setStyle(
            style
        );
}


// ==========================================================
// MODAL HELPER
// ==========================================================

function createModal(
    id,
    title,
    fields
) {

    const modal =
        new ModalBuilder()

            .setCustomId(
                id
            )

            .setTitle(
                title
            );

    for (
        const field of fields
    ) {

        modal.addComponents(

            input(
                field[0],
                field[1],
                field[2],
                true,
                field[3]
            )

        );
    }

    return modal;
}


// ==========================================================
// INPUT HELPER
// ==========================================================

function input(
    id,
    label,
    placeholder,
    required = true,
    style = TextInputStyle.Short
) {

    return new ActionRowBuilder()
        .addComponents(

            new TextInputBuilder()

                .setCustomId(
                    id
                )

                .setLabel(
                    label
                )

                .setPlaceholder(
                    placeholder
                )

                .setRequired(
                    required
                )

                .setStyle(
                    style
                )

        );
}