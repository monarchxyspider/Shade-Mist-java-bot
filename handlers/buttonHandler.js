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

// ==========================================
// FILE
// ==========================================

const dataFolder = path.join(
    process.cwd(),
    "data"
);

const configFile = path.join(
    dataFolder,
    "welcome.json"
);

// ==========================================
// CREATE DATA FOLDER
// ==========================================

if (!fs.existsSync(dataFolder)) {

    fs.mkdirSync(dataFolder, {
        recursive: true
    });

}

// ==========================================
// CREATE JSON FILE
// ==========================================

if (!fs.existsSync(configFile)) {

    fs.writeFileSync(
        configFile,
        JSON.stringify({}, null, 4)
    );

}

// ==========================================
// READ DATA
// ==========================================

function getWelcomeData() {

    try {

        return JSON.parse(
            fs.readFileSync(
                configFile,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "[Welcome] Failed to read welcome.json:",
            error
        );

        return {};

    }

}

// ==========================================
// SAVE DATA
// ==========================================

function saveWelcomeData(data) {

    fs.writeFileSync(
        configFile,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}

// ==========================================
// DEFAULT SERVER DATA
// ==========================================

function createServerData(client) {

    return {

        enabled: false,

        channelId: null,

        message: "",

        dmMessage: "",

        embed: {

            color: client.config.embedColor,

            title: "",

            description: "",

            thumbnail: "",

            image: "",

            author: {

                name: "",

                url: "",

                iconURL: ""

            }

        }

    };

}

// ==========================================
// BUTTON HANDLER
// ==========================================

module.exports = async (
    client,
    interaction
) => {

    try {

        if (!interaction.isButton()) {
            return;
        }

        if (
            !interaction.customId.startsWith(
                "welcome_"
            )
        ) {
            return;
        }

        if (!interaction.guild) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} This button can only be used inside a server.`,
                ephemeral: true
            });

        }

        const guildId =
            interaction.guild.id;

        const data =
            getWelcomeData();

        if (!data[guildId]) {

            data[guildId] =
                createServerData(client);

            saveWelcomeData(data);

        }

        const serverData =
            data[guildId];

        // ======================================
        // ENABLE
        // ======================================

        if (
            interaction.customId ===
            "welcome_enable"
        ) {

            serverData.enabled = true;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }

        // ======================================
        // DISABLE
        // ======================================

        if (
            interaction.customId ===
            "welcome_disable"
        ) {

            serverData.enabled = false;

            saveWelcomeData(data);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }

        // ======================================
        // EDIT EMBED
        // ======================================

        if (
            interaction.customId ===
            "welcome_edit_embed"
        ) {

            return showEditEmbedPanel(
                client,
                interaction,
                serverData
            );

        }

        // ======================================
        // EDIT AUTHOR
        // ======================================

        if (
            interaction.customId ===
            "welcome_edit_author"
        ) {

            const modal =
                createAuthorModal();

            return interaction.showModal(
                modal
            );

        }

        // ======================================
        // VARIABLES
        // ======================================

        if (
            interaction.customId ===
            "welcome_variables"
        ) {

            return showVariables(
                client,
                interaction
            );

        }

        // ======================================
        // TEST
        // ======================================

        if (
            interaction.customId ===
            "welcome_test"
        ) {

            return interaction.reply({
                content:
                    `${client.config.emojis.success} The welcome test system will be connected after the welcome message editor is completed.`,
                ephemeral: true
            });

        }

        // ======================================
        // RETURN MAIN
        // ======================================

        if (
            interaction.customId ===
            "welcome_return_main"
        ) {

            return updateMainPanel(
                client,
                interaction,
                serverData
            );

        }

    } catch (error) {

        console.error(
            "[buttonHandler] Error:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({
                content:
                    `${client.config.emojis.error} Something went wrong.`,
                ephemeral: true
            }).catch(() => {});

        }

    }

};

// ==========================================
// MAIN PANEL
// ==========================================

async function updateMainPanel(
    client,
    interaction,
    serverData
) {

    const status =
        serverData.enabled
            ? "🟢 Enabled"
            : "🔴 Disabled";

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
                    `${client.config.emojis.message} **Status**`,
                    `> ${status}`,
                    "",
                    `${client.config.emojis.user} **Welcome Channel**`,
                    `> ${channel}`,
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

    const test =
        new ButtonBuilder()
            .setCustomId(
                "welcome_test"
            )
            .setLabel(
                "Test Message"
            )
            .setStyle(
                ButtonStyle.Success
            );

    const row1 =
        new ActionRowBuilder()
            .addComponents(
                toggle,
                edit
            );

    const row2 =
        new ActionRowBuilder()
            .addComponents(
                variables,
                test
            );

    return interaction.update({
        embeds: [embed],
        components: [
            row1,
            row2
        ]
    });

}

// ==========================================
// EDIT EMBED PANEL
// ==========================================

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
                    "Customize your welcome embed.",
                    "",
                    "Choose an option below to edit your welcome message."
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
        embeds: [embed],
        components: [
            row1,
            row2,
            row3,
            row4
        ]
    });

}

// ==========================================
// VARIABLES
// ==========================================

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
                    "Use these variables in your welcome message:",
                    "",
                    "`{user.mention}`",
                    "Mentions the new member.",
                    "",
                    "`{user.id}`",
                    "New member's ID.",
                    "",
                    "`{user.avatar}`",
                    "New member's avatar URL.",
                    "",
                    "`{user.joinat}`",
                    "Member's join date.",
                    "",
                    "`{timestamp}`",
                    "Current timestamp.",
                    "",
                    "`{guild.members}`",
                    "Total server members."
                ].join("\n")
            )
            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })
            .setTimestamp();

    const back =
        new ButtonBuilder()
            .setCustomId(
                "welcome_return_main"
            )
            .setLabel(
                "Return to Main"
            )
            .setStyle(
                ButtonStyle.Danger
            );

    const row =
        new ActionRowBuilder()
            .addComponents(
                back
            );

    return interaction.update({
        embeds: [embed],
        components: [row]
    });

}

// ==========================================
// AUTHOR MODAL
// ==========================================

function createAuthorModal() {

    const modal =
        new ModalBuilder()
            .setCustomId(
                "welcome_author_modal"
            )
            .setTitle(
                "Edit Welcome Author"
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
            .setMaxLength(256);

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
            .setRequired(false);

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
            .setRequired(false);

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