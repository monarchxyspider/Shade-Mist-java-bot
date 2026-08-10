const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ==========================================
// FILE LOCATION
// ==========================================

const dataFolder = path.join(process.cwd(), "data");
const configFile = path.join(dataFolder, "welcome.json");

// ==========================================
// MAKE SURE DATA FOLDER EXISTS
// ==========================================

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, {
        recursive: true
    });
}

// ==========================================
// MAKE SURE JSON FILE EXISTS
// ==========================================

if (!fs.existsSync(configFile)) {
    fs.writeFileSync(
        configFile,
        JSON.stringify({}, null, 4)
    );
}

// ==========================================
// READ WELCOME DATA
// ==========================================

function getWelcomeData() {

    try {

        const data = fs.readFileSync(
            configFile,
            "utf8"
        );

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "[Welcome] Failed to read welcome.json:",
            error
        );

        return {};
    }
}

// ==========================================
// SAVE WELCOME DATA
// ==========================================

function saveWelcomeData(data) {

    try {

        fs.writeFileSync(
            configFile,
            JSON.stringify(data, null, 4)
        );

    } catch (error) {

        console.error(
            "[Welcome] Failed to save welcome.json:",
            error
        );

        throw error;
    }
}

// ==========================================
// MAIN BUTTON HANDLER
// ==========================================

module.exports = async (client, interaction) => {

    try {

        // ======================================
        // ONLY BUTTONS
        // ======================================

        if (!interaction.isButton()) {
            return;
        }

        // ======================================
        // ONLY WELCOME BUTTONS
        // ======================================

        if (!interaction.customId.startsWith("welcome_")) {
            return;
        }

        // ======================================
        // GET GUILD
        // ======================================

        const guild = interaction.guild;

        if (!guild) {

            return interaction.reply({
                content: `${client.config.emojis.error} This button can only be used inside a server.`,
                ephemeral: true
            });

        }

        // ======================================
        // LOAD DATA
        // ======================================

        const welcomeData = getWelcomeData();

        // ======================================
        // CREATE SERVER DATA IF MISSING
        // ======================================

        if (!welcomeData[guild.id]) {

            welcomeData[guild.id] = {
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

            saveWelcomeData(welcomeData);
        }

        const serverData = welcomeData[guild.id];

        // ======================================
        // ENABLE
        // ======================================

        if (interaction.customId === "welcome_enable") {

            serverData.enabled = true;

            saveWelcomeData(welcomeData);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );
        }

        // ======================================
        // DISABLE
        // ======================================

        if (interaction.customId === "welcome_disable") {

            serverData.enabled = false;

            saveWelcomeData(welcomeData);

            return updateMainPanel(
                client,
                interaction,
                serverData
            );
        }

        // ======================================
        // EDIT EMBED
        // ======================================

        if (interaction.customId === "welcome_edit_embed") {

            return showEditEmbedPanel(
                client,
                interaction,
                serverData
            );
        }

        // ======================================
        // VARIABLES
        // ======================================

        if (interaction.customId === "welcome_variables") {

            return showVariables(
                client,
                interaction
            );
        }

        // ======================================
        // TEST MESSAGE
        // ======================================

        if (interaction.customId === "welcome_test") {

            return interaction.reply({
                content: `${client.config.emojis.success} Welcome test system will be connected next.`,
                ephemeral: true
            });
        }

        // ======================================
        // RETURN TO MAIN
        // ======================================

        if (interaction.customId === "welcome_return_main") {

            return updateMainPanel(
                client,
                interaction,
                serverData
            );
        }

        // ======================================
        // UNKNOWN BUTTON
        // ======================================

        return;

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
                content: `${client.config.emojis.error} Something went wrong while processing this button.`,
                ephemeral: true
            }).catch(() => {});

        }
    }
};

// ==========================================
// UPDATE MAIN PANEL
// ==========================================

async function updateMainPanel(
    client,
    interaction,
    serverData
) {

    const status = serverData.enabled
        ? "🟢 Enabled"
        : "🔴 Disabled";

    const channel = serverData.channelId
        ? `<#${serverData.channelId}>`
        : "Not configured";

    const messageStatus = serverData.message
        ? "Configured"
        : "Not configured";

    const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setAuthor({
            name: `${client.config.botName} • Welcome System`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle("Welcome Configuration")
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
            text: `${client.config.botName} • Welcome System`
        })
        .setTimestamp();

    // ======================================
    // FIRST ROW
    // ======================================

    const enableButton = new ButtonBuilder()
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

    const editButton = new ButtonBuilder()
        .setCustomId("welcome_edit_embed")
        .setLabel("Edit Embed")
        .setStyle(ButtonStyle.Secondary);

    // ======================================
    // SECOND ROW
    // ======================================

    const variablesButton = new ButtonBuilder()
        .setCustomId("welcome_variables")
        .setLabel("Variables")
        .setStyle(ButtonStyle.Secondary);

    const testButton = new ButtonBuilder()
        .setCustomId("welcome_test")
        .setLabel("Test Message")
        .setStyle(ButtonStyle.Success);

    const row1 = new ActionRowBuilder()
        .addComponents(
            enableButton,
            editButton
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            variablesButton,
            testButton
        );

    // ======================================
    // UPDATE MESSAGE
    // ======================================

    if (interaction.deferred || interaction.replied) {

        return interaction.editReply({
            embeds: [embed],
            components: [
                row1,
                row2
            ]
        });

    }

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

    const embed = new EmbedBuilder()
        .setColor(
            serverData.embed?.color ||
            client.config.embedColor
        )
        .setAuthor({
            name: `${client.config.botName} • Welcome Embed`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle("Edit Welcome Embed")
        .setDescription(
            [
                "Customize your welcome embed using the buttons below.",
                "",
                "Choose an option to edit the corresponding part of your welcome message."
            ].join("\n")
        )
        .setFooter({
            text: `${client.config.botName} • Welcome System`
        })
        .setTimestamp();

    const row1 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("welcome_edit_author")
                .setLabel("Edit Author")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("welcome_edit_text")
                .setLabel("Edit Text")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("welcome_edit_dm")
                .setLabel("Edit DM Message")
                .setStyle(ButtonStyle.Secondary)

        );

    const row2 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("welcome_edit_description")
                .setLabel("Edit Description")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("welcome_edit_title")
                .setLabel("Edit Title")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("welcome_edit_thumbnail")
                .setLabel("Edit Thumbnail")
                .setStyle(ButtonStyle.Secondary)

        );

    const row3 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("welcome_edit_image")
                .setLabel("Edit Image")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("welcome_random_color")
                .setLabel("Random Embed")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("welcome_embed_color")
                .setLabel("Edit Embed Colour")
                .setStyle(ButtonStyle.Secondary)

        );

    const row4 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("welcome_return_main")
                .setLabel("Return to Main")
                .setStyle(ButtonStyle.Danger)

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
// VARIABLES PANEL
// ==========================================

async function showVariables(
    client,
    interaction
) {

    const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setAuthor({
            name: `${client.config.botName} • Welcome Variables`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle("Welcome Variables")
        .setDescription(
            [
                "Use these variables inside your welcome message:",
                "",
                "`{user.mention}`",
                "→ Mentions the new member.",
                "",
                "`{user.id}`",
                "→ New member's ID.",
                "",
                "`{user.avatar}`",
                "→ New member's avatar URL.",
                "",
                "`{user.joinat}`",
                "→ Member's join date.",
                "",
                "`{timestamp}`",
                "→ Current timestamp.",
                "",
                "`{guild.members}`",
                "→ Total server members."
            ].join("\n")
        )
        .setFooter({
            text: `${client.config.botName} • Welcome System`
        })
        .setTimestamp();

    const backButton = new ButtonBuilder()
        .setCustomId("welcome_return_main")
        .setLabel("Return to Main")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(backButton);

    return interaction.update({
        embeds: [embed],
        components: [row]
    });
}