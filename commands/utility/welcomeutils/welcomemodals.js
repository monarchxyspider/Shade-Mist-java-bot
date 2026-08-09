const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (client, interaction) => {

    const id = interaction.customId;

    if (!client.welcomeConfigs) {
        client.welcomeConfigs = new Map();
    }

    const guildId =
        interaction.guild.id;

    const config =
        client.welcomeConfigs.get(
            guildId
        ) || {};

    config.embed =
        config.embed || {};

    // ==================================================
    // AUTHOR
    // ==================================================

    if (id === "welcome_modal_author") {

        config.embed.author = {

            name:
                interaction.fields.getTextInputValue(
                    "author_name"
                ),

            url:
                interaction.fields.getTextInputValue(
                    "author_url"
                ) || null,

            iconURL:
                interaction.fields.getTextInputValue(
                    "author_icon"
                ) || null
        };
    }

    // ==================================================
    // DESCRIPTION
    // ==================================================

    else if (
        id === "welcome_modal_description"
    ) {

        config.embed.description =
            interaction.fields.getTextInputValue(
                "description"
            );
    }

    // ==================================================
    // TITLE
    // ==================================================

    else if (
        id === "welcome_modal_title"
    ) {

        config.embed.title =
            interaction.fields.getTextInputValue(
                "title"
            );
    }

    // ==================================================
    // THUMBNAIL
    // ==================================================

    else if (
        id === "welcome_modal_thumbnail"
    ) {

        config.embed.thumbnail =
            interaction.fields.getTextInputValue(
                "thumbnail"
            );
    }

    // ==================================================
    // IMAGE
    // ==================================================

    else if (
        id === "welcome_modal_image"
    ) {

        config.embed.image =
            interaction.fields.getTextInputValue(
                "image"
            );
    }

    // ==================================================
    // COLOUR
    // ==================================================

    else if (
        id === "welcome_modal_colour"
    ) {

        let colour =
            interaction.fields.getTextInputValue(
                "colour"
            ).trim();

        if (!colour.startsWith("#")) {
            colour = `#${colour}`;
        }

        if (
            !/^#[0-9A-F]{6}$/i.test(
                colour
            )
        ) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Invalid HEX colour. Example: \`#5865F2\``,
                ephemeral: true
            });
        }

        config.embed.color =
            colour;
    }

    // ==================================================
    // WELCOME TEXT
    // ==================================================

    else if (
        id === "welcome_modal_text"
    ) {

        config.message =
            interaction.fields.getTextInputValue(
                "message"
            );
    }

    // ==================================================
    // DM MESSAGE
    // ==================================================

    else if (
        id === "welcome_modal_dm"
    ) {

        config.dmMessage =
            interaction.fields.getTextInputValue(
                "dm_message"
            );

        config.dmEnabled = true;
    }

    // ==================================================
    // ADD BUTTON
    // ==================================================

    else if (
        id === "welcome_modal_add_button"
    ) {

        const label =
            interaction.fields.getTextInputValue(
                "button_label"
            );

        const emoji =
            interaction.fields.getTextInputValue(
                "button_emoji"
            );

        const colour =
            interaction.fields.getTextInputValue(
                "button_colour"
            );

        const url =
            interaction.fields.getTextInputValue(
                "button_url"
            );

        const customId =
            interaction.fields.getTextInputValue(
                "button_id"
            );

        config.buttons =
            config.buttons || [];

        if (
            config.buttons.length >= 5
        ) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} You can add a maximum of **5 buttons**.`,
                ephemeral: true
            });
        }

        config.buttons.push({

            label:
                label || "Button",

            emoji:
                emoji || null,

            style:
                colour || "Blue",

            url:
                url || null,

            customId:
                customId ||
                `welcome_button_${Date.now()}`
        });
    }

    else {

        return;
    }

    // ==================================================
    // SAVE
    // ==================================================

    client.welcomeConfigs.set(
        guildId,
        config
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return interaction.reply({
        content:
            `${client.config.emojis.success} **Welcome settings updated successfully.**`,
        ephemeral: true
    });
};