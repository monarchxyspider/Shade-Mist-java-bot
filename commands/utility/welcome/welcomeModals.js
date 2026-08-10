const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async function (client, interaction) {

    const guild = interaction.guild;

    if (!guild) return;

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
    // EDIT AUTHOR
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_author"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_author"
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
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setMaxLength(256)
                .setValue(
                    config.embed.author?.name || ""
                )
                .setPlaceholder(
                    "Example: Welcome to our server!"
                );

        const url =
            new TextInputBuilder()
                .setCustomId(
                    "author_url"
                )
                .setLabel(
                    "Author URL"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setPlaceholder(
                    "https://example.com"
                )
                .setValue(
                    config.embed.author?.url || ""
                );

        const icon =
            new TextInputBuilder()
                .setCustomId(
                    "author_icon"
                )
                .setLabel(
                    "Author Icon URL"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setPlaceholder(
                    "https://example.com/icon.png"
                )
                .setValue(
                    config.embed.author?.iconURL || ""
                );

        modal.addComponents(

            new ActionRowBuilder()
                .addComponents(name),

            new ActionRowBuilder()
                .addComponents(url),

            new ActionRowBuilder()
                .addComponents(icon)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT TEXT
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_text"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_text"
                )
                .setTitle(
                    "Edit Welcome Message"
                );

        const text =
            new TextInputBuilder()
                .setCustomId(
                    "welcome_text"
                )
                .setLabel(
                    "Welcome Message"
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(false)
                .setMaxLength(2000)
                .setValue(
                    config.message || ""
                )
                .setPlaceholder(
                    "Use {user.mention}, {guild.name}, etc."
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(text)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT TITLE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_title"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_title"
                )
                .setTitle(
                    "Edit Embed Title"
                );

        const title =
            new TextInputBuilder()
                .setCustomId(
                    "embed_title"
                )
                .setLabel(
                    "Embed Title"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setMaxLength(256)
                .setValue(
                    config.embed.title || ""
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(title)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT DESCRIPTION
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_description"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_description"
                )
                .setTitle(
                    "Edit Embed Description"
                );

        const description =
            new TextInputBuilder()
                .setCustomId(
                    "embed_description"
                )
                .setLabel(
                    "Embed Description"
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(false)
                .setMaxLength(4096)
                .setValue(
                    config.embed.description || ""
                )
                .setPlaceholder(
                    "Write your welcome embed description..."
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(description)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT THUMBNAIL
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_thumbnail"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_thumbnail"
                )
                .setTitle(
                    "Edit Embed Thumbnail"
                );

        const thumbnail =
            new TextInputBuilder()
                .setCustomId(
                    "thumbnail_url"
                )
                .setLabel(
                    "Thumbnail URL"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setValue(
                    config.embed.thumbnail || ""
                )
                .setPlaceholder(
                    "https://example.com/image.png"
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(thumbnail)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT IMAGE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_image"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_image"
                )
                .setTitle(
                    "Edit Embed Image"
                );

        const image =
            new TextInputBuilder()
                .setCustomId(
                    "image_url"
                )
                .setLabel(
                    "Image URL"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setValue(
                    config.embed.image || ""
                )
                .setPlaceholder(
                    "https://example.com/image.gif"
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(image)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT EMBED COLOUR
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_color"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_color"
                )
                .setTitle(
                    "Edit Embed Colour"
                );

        const color =
            new TextInputBuilder()
                .setCustomId(
                    "embed_color"
                )
                .setLabel(
                    "HEX Colour"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(7)
                .setValue(
                    config.embed.color || "#ff0000"
                )
                .setPlaceholder(
                    "#ff0000"
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(color)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // EDIT DM
    // ==================================================

    if (
        interaction.customId ===
        "welcome_edit_dm"
    ) {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "welcome_modal_dm"
                )
                .setTitle(
                    "Edit Welcome DM"
                );

        const dm =
            new TextInputBuilder()
                .setCustomId(
                    "dm_message"
                )
                .setLabel(
                    "DM Message"
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(false)
                .setMaxLength(2000)
                .setValue(
                    config.dmMessage || ""
                )
                .setPlaceholder(
                    "Message sent privately to new members..."
                );

        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(dm)
        );

        return interaction.showModal(modal);
    }

    // ==================================================
    // RANDOM COLOUR
    // ==================================================

    if (
        interaction.customId ===
        "welcome_random_color"
    ) {

        const randomColor =
            Math.floor(
                Math.random() * 0xffffff
            );

        config.embed.color =
            randomColor;

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return interaction.reply({
            content:
                `${client.config.emojis.success} Random embed colour generated successfully.`,
            ephemeral: true
        });
    }

    // ==================================================
    // MODAL: AUTHOR
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_author"
    ) {

        config.embed.author = {

            name:
                interaction.fields.getTextInputValue(
                    "author_name"
                ).trim(),

            url:
                interaction.fields.getTextInputValue(
                    "author_url"
                ).trim(),

            iconURL:
                interaction.fields.getTextInputValue(
                    "author_icon"
                ).trim()
        };

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Welcome author updated successfully."
        );
    }

    // ==================================================
    // MODAL: TEXT
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_text"
    ) {

        config.message =
            interaction.fields.getTextInputValue(
                "welcome_text"
            );

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Welcome message updated successfully."
        );
    }

    // ==================================================
    // MODAL: TITLE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_title"
    ) {

        config.embed.title =
            interaction.fields.getTextInputValue(
                "embed_title"
            );

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Embed title updated successfully."
        );
    }

    // ==================================================
    // MODAL: DESCRIPTION
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_description"
    ) {

        config.embed.description =
            interaction.fields.getTextInputValue(
                "embed_description"
            );

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Embed description updated successfully."
        );
    }

    // ==================================================
    // MODAL: THUMBNAIL
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_thumbnail"
    ) {

        config.embed.thumbnail =
            interaction.fields.getTextInputValue(
                "thumbnail_url"
            ).trim();

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Embed thumbnail updated successfully."
        );
    }

    // ==================================================
    // MODAL: IMAGE
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_image"
    ) {

        config.embed.image =
            interaction.fields.getTextInputValue(
                "image_url"
            ).trim();

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Embed image updated successfully."
        );
    }

    // ==================================================
    // MODAL: COLOUR
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_color"
    ) {

        let color =
            interaction.fields.getTextInputValue(
                "embed_color"
            ).trim();

        if (!/^#[0-9A-F]{6}$/i.test(color)) {

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Invalid HEX colour. Use a format like \`#ff0000\`.`,
                ephemeral: true
            });
        }

        config.embed.color =
            color;

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Embed colour updated successfully."
        );
    }

    // ==================================================
    // MODAL: DM
    // ==================================================

    if (
        interaction.customId ===
        "welcome_modal_dm"
    ) {

        const dm =
            interaction.fields.getTextInputValue(
                "dm_message"
            );

        config.dmMessage =
            dm;

        config.dmEnabled =
            Boolean(dm.trim());

        client.welcomeConfigs.set(
            guild.id,
            config
        );

        return success(
            client,
            interaction,
            "Welcome DM updated successfully."
        );
    }
};


// ==========================================================
// SUCCESS RESPONSE
// ==========================================================

async function success(
    client,
    interaction,
    text
) {

    return interaction.reply({
        content:
            `${client.config.emojis.success} ${text}`,
        ephemeral: true
    });
}