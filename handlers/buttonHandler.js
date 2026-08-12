const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");


// ==================================================
// FILE
// ==================================================

const dataFolder = path.join(
    process.cwd(),
    "data"
);

const configFile = path.join(
    dataFolder,
    "welcome.json"
);


// ==================================================
// CREATE DATA FOLDER
// ==================================================

function ensureDataFile() {

    if (!fs.existsSync(dataFolder)) {

        fs.mkdirSync(
            dataFolder,
            {
                recursive: true
            }
        );

    }


    if (!fs.existsSync(configFile)) {

        fs.writeFileSync(
            configFile,
            JSON.stringify(
                {},
                null,
                4
            )
        );

    }

}


// ==================================================
// READ DATA
// ==================================================

function getWelcomeData() {

    ensureDataFile();

    try {

        const raw =
            fs.readFileSync(
                configFile,
                "utf8"
            );

        if (!raw.trim()) {
            return {};
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "[Welcome] Failed to read welcome.json:",
            error
        );

        return {};

    }

}


// ==================================================
// SAVE DATA
// ==================================================

function saveWelcomeData(data) {

    ensureDataFile();

    try {

        fs.writeFileSync(

            configFile,

            JSON.stringify(
                data,
                null,
                4
            )

        );

        return true;

    } catch (error) {

        console.error(
            "[Welcome] Failed to save welcome.json:",
            error
        );

        return false;

    }

}


// ==================================================
// DEFAULT DATA
// ==================================================

function createServerData(client) {

    return {

        enabled: false,

        channelId: null,

        dmEnabled: false,

        background: null,

        message: "",

        dmMessage: "",

        embed: {

            color:
                client.config.embedColor,

            title: "",

            description: "",

            thumbnail: "",

            image: "",

            author: {

                name: "",

                url: "",

                iconURL: ""

            },

            footer: {

                text: "",

                iconURL: ""

            },

            timestamp: false

        }

    };

}


// ==================================================
// GET SERVER DATA
// ==================================================

function getServerData(
    client,
    guildId
) {

    const data =
        getWelcomeData();


    if (!data[guildId]) {

        data[guildId] =
            createServerData(client);

        saveWelcomeData(data);

    }


    return {
        data,
        serverData: data[guildId]
    };

}


// ==================================================
// BUTTON HANDLER
// ==================================================

module.exports = async (
    client,
    interaction
) => {

    try {

        // ==========================================
        // ONLY BUTTONS
        // ==========================================

        if (!interaction.isButton()) {
            return;
        }


        // ==========================================
        // ONLY WELCOME BUTTONS
        // ==========================================

        if (
            !interaction.customId.startsWith(
                "welcome_"
            )
        ) {
            return;
        }


        // ==========================================
        // SERVER CHECK
        // ==========================================

        if (!interaction.guild) {

            return interaction.reply({

                content:
                    `${client.config.emojis.error} This button can only be used inside a server.`,

                ephemeral: true

            });

        }


        const guildId =
            interaction.guild.id;


        const {
            data,
            serverData
        } =
            getServerData(
                client,
                guildId
            );


        const id =
            interaction.customId;


        // ==========================================
        // ENABLE
        // ==========================================

        if (
            id === "welcome_enable"
        ) {

            serverData.enabled = true;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // DISABLE
        // ==========================================

        if (
            id === "welcome_disable"
        ) {

            serverData.enabled = false;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // DM ENABLE
        // ==========================================

        if (
            id === "welcome_dm_enable"
        ) {

            serverData.dmEnabled = true;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // DM DISABLE
        // ==========================================

        if (
            id === "welcome_dm_disable"
        ) {

            serverData.dmEnabled = false;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // EDIT EMBED
        // ==========================================

        if (
            id === "welcome_edit_embed"
        ) {

            return showEditEmbedPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // EDIT AUTHOR
        // ==========================================

        if (
            id === "welcome_edit_author"
        ) {

            return interaction.showModal(
                createAuthorModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EDIT TEXT
        // ==========================================

        if (
            id === "welcome_edit_text"
        ) {

            return interaction.showModal(
                createTextModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EDIT DESCRIPTION
        // ==========================================

        if (
            id === "welcome_edit_description"
        ) {

            return interaction.showModal(
                createDescriptionModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EDIT TITLE
        // ==========================================

        if (
            id === "welcome_edit_title"
        ) {

            return interaction.showModal(
                createTitleModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EDIT THUMBNAIL
        // ==========================================

        if (
            id === "welcome_edit_thumbnail"
        ) {

            return interaction.showModal(
                createThumbnailModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EDIT IMAGE
        // ==========================================

        if (
            id === "welcome_edit_image"
        ) {

            return interaction.showModal(
                createImageModal(
                    serverData
                )
            );

        }


        // ==========================================
        // EMBED COLOUR
        // ==========================================

        if (
            id === "welcome_embed_color"
        ) {

            return interaction.showModal(
                createColorModal(
                    serverData
                )
            );

        }


        // ==========================================
        // RANDOM COLOUR
        // ==========================================

        if (
            id === "welcome_random_color"
        ) {

            serverData.embed.color =
                randomColor();

            saveWelcomeData(data);

            return showEditEmbedPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // VARIABLES
        // ==========================================

        if (
            id === "welcome_variables"
        ) {

            return showVariables(
                client,
                interaction
            );

        }


        // ==========================================
        // TEST
        // ==========================================

        if (
            id === "welcome_test" ||
            id === "welcome_test_all"
        ) {

            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome test will be connected to the final welcome sender.`,

                ephemeral: true

            });

        }


        // ==========================================
        // BACKGROUND
        // ==========================================

        if (
            id === "welcome_background"
        ) {

            return interaction.showModal(
                createBackgroundModal(
                    serverData
                )
            );

        }


        // ==========================================
        // RETURN MAIN
        // ==========================================

        if (
            id === "welcome_return_main"
        ) {

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }


        // ==========================================
        // UNKNOWN BUTTON
        // ==========================================

        return interaction.reply({

            content:
                `${client.config.emojis.error} This welcome button is not configured yet.`,

            ephemeral: true

        });


    } catch (error) {

        console.error(
            "[buttonHandler] Error:",
            error
        );


        if (
            interaction.replied ||
            interaction.deferred
        ) {
            return;
        }


        return interaction.reply({

            content:
                `${client.config.emojis.error} Something went wrong while processing this button.`,

            ephemeral: true

        }).catch(() => {});

    }

};


// ==================================================
// MAIN PANEL
// ==================================================

async function updateMainPanel(
    client,
    interaction,
    serverData
) {

    const status =
        serverData.enabled
            ? `${client.config.emojis.statusOnline} **Enabled**`
            : `${client.config.emojis.statusOffline} **Disabled**`;


    const dmStatus =
        serverData.dmEnabled
            ? `${client.config.emojis.statusOnline} **Enabled**`
            : `${client.config.emojis.statusOffline} **Disabled**`;


    const channel =
        serverData.channelId
            ? `<#${serverData.channelId}>`
            : "Not configured";


    const messageStatus =
        serverData.message
            ? "Configured"
            : "Not configured";


    const embed =
        new EmbedBuilder()

            .setColor(
                client.config.embedColor
            )

            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setTitle(
                "Welcome Configuration"
            )

            .setDescription(
                [
                    "Configure your server's welcome system from this panel.",
                    "",
                    `${client.config.emojis.stats} **Status**`,
                    `> ${status}`,
                    "",
                    `${client.config.emojis.place} **Welcome Channel**`,
                    `> ${channel}`,
                    "",
                    `${client.config.emojis.message} **DM**`,
                    `> ${dmStatus}`,
                    "",
                    `${client.config.emojis.moderator} **Welcome Message**`,
                    `> ${messageStatus}`
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })

            .setTimestamp();


    // ==========================================
    // TOGGLE
    // ==========================================

    const toggle =
        new ButtonBuilder()

            .setCustomId(
                serverData.enabled
                    ? "welcome_disable"
                    : "welcome_enable"
            )

            .setLabel(
                serverData.enabled
                    ? "Disable"
                    : "Enable"
            )

            .setStyle(
                serverData.enabled
                    ? ButtonStyle.Success
                    : ButtonStyle.Primary
            );


    // ==========================================
    // EDIT
    // ==========================================

    const edit =
        new ButtonBuilder()

            .setCustomId(
                "welcome_edit_embed"
            )

            .setLabel(
                "Edit Embed"
            )

            .setStyle(
                ButtonStyle.Secondary
            );


    // ==========================================
    // DM
    // ==========================================

    const dm =
        new ButtonBuilder()

            .setCustomId(
                serverData.dmEnabled
                    ? "welcome_dm_disable"
                    : "welcome_dm_enable"
            )

            .setLabel(
                serverData.dmEnabled
                    ? "DM: ON"
                    : "DM: OFF"
            )

            .setStyle(
                serverData.dmEnabled
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary
            );


    // ==========================================
    // VARIABLES
    // ==========================================

    const variables =
        new ButtonBuilder()

            .setCustomId(
                "welcome_variables"
            )

            .setLabel(
                "Variables"
            )

            .setStyle(
                ButtonStyle.Secondary
            );


    // ==========================================
    // TEST
    // ==========================================

    const test =
        new ButtonBuilder()

            .setCustomId(
                "welcome_test_all"
            )

            .setLabel(
                "Test All"
            )

            .setStyle(
                ButtonStyle.Success
            );


    // ==========================================
    // ROWS
    // ==========================================

    const row1 =
        new ActionRowBuilder()
            .addComponents(
                toggle,
                edit
            );


    const row2 =
        new ActionRowBuilder()
            .addComponents(
                dm,
                variables,
                test
            );


    return interaction.update({

        embeds: [
            embed
        ],

        components: [
            row1,
            row2
        ]

    });

}


// ==================================================
// EDIT EMBED PANEL
// ==================================================

async function showEditEmbedPanel(
    client,
    interaction,
    serverData
) {

    const embed =
        new EmbedBuilder()

            .setColor(
                serverData.embed?.color ||
                client.config.embedColor
            )

            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Embed`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setTitle(
                "Edit Welcome Embed"
            )

            .setDescription(
                [
                    "Customize your welcome embed using the options below.",
                    "",
                    `${client.config.emojis.gear} **Author**`,
                    "> Edit author name, URL and icon.",
                    "",
                    `${client.config.emojis.message} **Content**`,
                    "> Edit title, description and text.",
                    "",
                    `${client.config.emojis.place} **Media**`,
                    "> Edit thumbnail and image."
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })

            .setTimestamp();


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
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_dm"
                    )
                    .setLabel(
                        "Edit DM Message"
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
                        "welcome_edit_title"
                    )
                    .setLabel(
                        "Edit Title"
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
                    )
            );


    const row3 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_edit_image"
                    )
                    .setLabel(
                        "Edit Image"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_random_color"
                    )
                    .setLabel(
                        "Random Embed"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()
                    .setCustomId(
                        "welcome_embed_color"
                    )
                    .setLabel(
                        "Edit Embed Colour"
                    )
                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );


    const row4 =
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
                        ButtonStyle.Danger
                    )
            );


    return interaction.update({

        embeds: [
            embed
        ],

        components: [
            row1,
            row2,
            row3,
            row4
        ]

    });

}


// ==================================================
// VARIABLES
// ==================================================

async function showVariables(
    client,
    interaction
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

            .setTitle(
                "Welcome Variables"
            )

            .setDescription(
                [
                    "**USER**",
                    "",
                    "`{user.mention}`",
                    "`{user.id}`",
                    "`{user.name}`",
                    "`{user.username}`",
                    "`{user.tag}`",
                    "`{user.avatar}`",
                    "`{user.avatar.url}`",
                    "`{user.joinat}`",
                    "`{user.createdat}`",
                    "",
                    "**GUILD**",
                    "",
                    "`{guild.id}`",
                    "`{guild.name}`",
                    "`{guild.icon}`",
                    "`{guild.icon.url}`",
                    "`{guild.owner}`",
                    "`{guild.members}`",
                    "`{guild.members.bot}`",
                    "",
                    "**CHANNEL**",
                    "",
                    "`{channel.id}`",
                    "`{channel.name}`",
                    "",
                    "**TIME**",
                    "",
                    "`{timestamp}`",
                    "`{date}`",
                    "`{time}`"
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            });


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
                        ButtonStyle.Danger
                    )

            );


    return interaction.update({

        embeds: [
            embed
        ],

        components: [
            row
        ]

    });

}


// ==================================================
// MODALS
// ==================================================

function createAuthorModal(
    serverData
) {

    const modal =
        new ModalBuilder()

            .setCustomId(
                "welcome_author_modal"
            )

            .setTitle(
                "Edit Author"
            );


    const name =
        new TextInputBuilder()

            .setCustomId(
                "author_name"
            )

            .setLabel(
                "Author Name"
            )

            .setPlaceholder(
                "Enter author name..."
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false)

            .setValue(
                serverData.embed?.author?.name || ""
            );


    const url =
        new TextInputBuilder()

            .setCustomId(
                "author_url"
            )

            .setLabel(
                "Author URL"
            )

            .setPlaceholder(
                "https://example.com"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false)

            .setValue(
                serverData.embed?.author?.url || ""
            );


    const icon =
        new TextInputBuilder()

            .setCustomId(
                "author_icon_url"
            )

            .setLabel(
                "Author Icon URL"
            )

            .setPlaceholder(
                "https://example.com/icon.png"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false)

            .setValue(
                serverData.embed?.author?.iconURL || ""
            );


    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(name),

        new ActionRowBuilder()
            .addComponents(url),

        new ActionRowBuilder()
            .addComponents(icon)

    );


    return modal;

}


function createTextModal(
    serverData
) {

    const modal =
        new ModalBuilder()
            .setCustomId(
                "welcome_text_modal"
            )
            .setTitle(
                "Edit Welcome Text"
            );


    const input =
        new TextInputBuilder()

            .setCustomId(
                "welcome_text"
            )

            .setLabel(
                "Welcome Text"
            )

            .setPlaceholder(
                "Welcome {user.mention} to {guild.name}!"
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setRequired(false)

            .setValue(
                serverData.message || ""
            );


    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(input)
    );


    return modal;

}


function createDescriptionModal(
    serverData
) {

    const modal =
        new ModalBuilder()
            .setCustomId(
                "welcome_description_modal"
            )
            .setTitle(
                "Edit Description"
            );


    const input =
        new TextInputBuilder()

            .setCustomId(
                "description"
            )

            .setLabel(
                "Description"
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setRequired(false)

            .setValue(
                serverData.embed?.description || ""
            );


    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(input)
    );


    return modal;

}


function createTitleModal(
    serverData
) {

    const modal =
        new ModalBuilder()
            .setCustomId(
                "welcome_title_modal"
            )
            .setTitle(
                "Edit Title"
            );


    const input =
        new TextInputBuilder()

            .setCustomId(
                "title"
            )

            .setLabel(
                "Title"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false)

            .setValue(
                serverData.embed?.title || ""
            );


    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(input)
    );


    return modal;

}


function createThumbnailModal(
    serverData
) {

    return createSingleInputModal(
        "welcome_thumbnail_modal",
        "Edit Thumbnail",
        "thumbnail",
        "Thumbnail URL",
        serverData.embed?.thumbnail || ""
    );

}


function createImageModal(
    serverData
) {

    return createSingleInputModal(
        "welcome_image_modal",
        "Edit Image",
        "image",
        "Image URL",
        serverData.embed?.image || ""
    );

}


function createColorModal(
    serverData
) {

    return createSingleInputModal(
        "welcome_color_modal",
        "Edit Embed Colour",
        "color",
        "Hex Colour",
        serverData.embed?.color || "#E53935"
    );

}


function createBackgroundModal(
    serverData
) {

    return createSingleInputModal(
        "welcome_background_modal",
        "Change Background",
        "background",
        "Background URL",
        serverData.background || ""
    );

}


function createSingleInputModal(
    customId,
    title,
    inputId,
    label,
    value
) {

    const modal =
        new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title);


    const input =
        new TextInputBuilder()

            .setCustomId(inputId)

            .setLabel(label)

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false)

            .setValue(
                value || ""
            );


    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(input)

    );


    return modal;

}


// ==================================================
// RANDOM COLOUR
// ==================================================

function randomColor() {

    return "#" +
        Math.floor(
            Math.random() * 16777215
        )
        .toString(16)
        .padStart(6, "0");

}