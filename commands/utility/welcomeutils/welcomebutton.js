const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = async (client, interaction) => {

    const id = interaction.customId;

    // ==================================================
    // ENABLE
    // ==================================================

    if (id === "welcome_enable") {

        if (!client.welcomeConfigs) {
            client.welcomeConfigs = new Map();
        }

        const config =
            client.welcomeConfigs.get(interaction.guild.id) || {};

        config.enabled = true;

        client.welcomeConfigs.set(
            interaction.guild.id,
            config
        );

        return interaction.update({
            content: null,
            embeds: [
                createMainEmbed(client, interaction, true)
            ],
            components: [
                createMainButtons(true)
            ]
        });
    }

    // ==================================================
    // DISABLE
    // ==================================================

    if (id === "welcome_disable") {

        if (!client.welcomeConfigs) {
            client.welcomeConfigs = new Map();
        }

        const config =
            client.welcomeConfigs.get(interaction.guild.id) || {};

        config.enabled = false;

        client.welcomeConfigs.set(
            interaction.guild.id,
            config
        );

        return interaction.update({
            embeds: [
                createMainEmbed(client, interaction, false)
            ],
            components: [
                createMainButtons(false)
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
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Edit Welcome Embed`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.info || "ℹ️"} **Welcome Embed Editor**\n\n` +
                        `Choose what you want to edit below.`
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(

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

                new ActionRowBuilder().addComponents(

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
                    ["author_name", "Author Name", "Welcome!", TextInputStyle.Short],
                    ["author_url", "Author URL", "https://example.com", TextInputStyle.Short],
                    ["author_icon", "Author Icon URL", "https://example.com/icon.png", TextInputStyle.Short]
                ]
            )
        );
    }

    // ==================================================
    // DESCRIPTION
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
    // TITLE
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
    // THUMBNAIL
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
    // IMAGE
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

        const randomColours = [
            "#5865F2",
            "#57F287",
            "#FEE75C",
            "#EB459E",
            "#ED4245",
            "#00A8FC",
            "#9B59B6"
        ];

        const colour =
            randomColours[
                Math.floor(
                    Math.random() *
                    randomColours.length
                )
            ];

        if (!client.welcomeConfigs) {
            client.welcomeConfigs = new Map();
        }

        const config =
            client.welcomeConfigs.get(
                interaction.guild.id
            ) || {};

        config.embed =
            config.embed || {};

        config.embed.color = colour;

        client.welcomeConfigs.set(
            interaction.guild.id,
            config
        );

        return interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(colour)
                    .setTitle("Random Embed")
                    .setDescription(
                        `${client.config.emojis.success || "✅"} A random embed colour has been selected.\n\n` +
                        `**Colour:** \`${colour}\``
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(
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

        return interaction.showModal(
            new ModalBuilder()
                .setCustomId("welcome_modal_add_button")
                .setTitle("Add Welcome Button")
                .addComponents(

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
                )
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
                    .setColor(client.config.embedColor)
                    .setTitle("Welcome Variables")
                    .setDescription(
                        [
                            "`{user.mention}` — Mention",
                            "`{user.id}` — User ID",
                            "`{user.name}` — Display name",
                            "`{user.username}` — Username",
                            "`{user.avatar}` — Avatar URL",
                            "`{user.joinat}` — Join date",
                            "",
                            "`{guild.name}` — Server name",
                            "`{guild.id}` — Server ID",
                            "`{guild.members}` — Member count",
                            "`{guild.owner}` — Server owner",
                            "`{guild.icon}` — Server icon",
                            "",
                            "`{timestamp}` — Current timestamp"
                        ].join("\n")
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(
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

        const config =
            client.welcomeConfigs?.get(
                interaction.guild.id
            );

        if (!config?.channelId) {

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
                    `${client.config.emojis.error} Welcome channel no longer exists.`,
                ephemeral: true
            });
        }

        await channel.send({
            content:
                `<@${interaction.user.id}>`,
            embeds: [
                new EmbedBuilder()
                    .setColor(
                        config.embed?.color ||
                        client.config.embedColor
                    )
                    .setTitle(
                        config.embed?.title ||
                        "Welcome!"
                    )
                    .setDescription(
                        config.embed?.description ||
                        `Welcome {user.mention} to {guild.name}!`
                    )
            ]
        });

        return interaction.reply({
            content:
                `${client.config.emojis.success} Test welcome message sent.`,
            ephemeral: true
        });
    }

    // ==================================================
    // RETURN
    // ==================================================

    if (id === "welcome_return") {

        const config =
            client.welcomeConfigs?.get(
                interaction.guild.id
            ) || {};

        return interaction.update({
            embeds: [
                createMainEmbed(
                    client,
                    interaction,
                    config.enabled
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
    enabled
) {

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
            `Configure your server welcome system using the buttons below.`
        )
        .setTimestamp();
}


// ==========================================================
// MAIN BUTTONS
// ==========================================================

function createMainButtons(enabled) {

    return [

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(
                    "welcome_enable"
                )
                .setLabel("Enable")
                .setEmoji("🟢")
                .setStyle(
                    enabled
                        ? ButtonStyle.Success
                        : ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_disable"
                )
                .setLabel("Disable")
                .setEmoji("🔴")
                .setStyle(
                    ButtonStyle.Danger
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_edit_embed"
                )
                .setLabel("Edit Embed")
                .setEmoji("📝")
                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_edit_text"
                )
                .setLabel("Edit Text")
                .setEmoji("💬")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_edit_dm"
                )
                .setLabel("Edit DM")
                .setEmoji("✉️")
                .setStyle(
                    ButtonStyle.Secondary
                )
        ),

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(
                    "welcome_channel"
                )
                .setLabel("Channel")
                .setEmoji("📢")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_variables"
                )
                .setLabel("Variables")
                .setEmoji("🔤")
                .setStyle(
                    ButtonStyle.Secondary
                ),

            new ButtonBuilder()
                .setCustomId(
                    "welcome_test"
                )
                .setLabel("Test")
                .setEmoji("🧪")
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
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);
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
            .setCustomId(id)
            .setTitle(title);

    for (const field of fields) {

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
                .setCustomId(id)
                .setLabel(label)
                .setPlaceholder(placeholder)
                .setRequired(required)
                .setStyle(style)
        );
}