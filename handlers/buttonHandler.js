const {
    EmbedBuilder
} = require("discord.js");

module.exports = async (client, interaction) => {

    try {

        // ==========================================
        // ONLY BUTTON INTERACTIONS
        // ==========================================

        if (!interaction.isButton()) {
            return;
        }

        // ==========================================
        // WELCOME BUTTONS
        // ==========================================

        if (interaction.customId.startsWith("welcome_")) {

            switch (interaction.customId) {

                // ==================================
                // ENABLE
                // ==================================

                case "welcome_enable":

                    await interaction.deferUpdate();

                    // Actual welcome configuration
                    // baad mein yahan connect hogi.

                    return;

                // ==================================
                // DISABLE
                // ==================================

                case "welcome_disable":

                    await interaction.deferUpdate();

                    // Actual welcome configuration
                    // baad mein yahan connect hogi.

                    return;

                // ==================================
                // EDIT EMBED
                // ==================================

                case "welcome_edit_embed":

                    await interaction.deferUpdate();

                    // Edit Embed panel
                    // baad mein yahan banega.

                    return;

                // ==================================
                // EDIT AUTHOR
                // ==================================

                case "welcome_edit_author":

                    await interaction.showModal(
                        createAuthorModal()
                    );

                    return;

                // ==================================
                // EDIT TEXT
                // ==================================

                case "welcome_edit_text":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EDIT DM MESSAGE
                // ==================================

                case "welcome_edit_dm":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EDIT DESCRIPTION
                // ==================================

                case "welcome_edit_description":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EDIT TITLE
                // ==================================

                case "welcome_edit_title":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EDIT THUMBNAIL
                // ==================================

                case "welcome_edit_thumbnail":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EDIT IMAGE
                // ==================================

                case "welcome_edit_image":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // RANDOM EMBED
                // ==================================

                case "welcome_random_color":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // EMBED COLOR
                // ==================================

                case "welcome_embed_color":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // VARIABLES
                // ==================================

                case "welcome_variables":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // TEST MESSAGE
                // ==================================

                case "welcome_test":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // RETURN TO MAIN
                // ==================================

                case "welcome_return_main":

                    await interaction.deferUpdate();

                    return;

                // ==================================
                // UNKNOWN WELCOME BUTTON
                // ==================================

                default:

                    return;
            }
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
                content: `${client.config.emojis.error} Something went wrong while processing this button.`,
                ephemeral: true
            }).catch(() => {});

        }
    }
};


// ==========================================
// AUTHOR MODAL
// ==========================================

function createAuthorModal() {

    const {
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        ActionRowBuilder
    } = require("discord.js");

    const modal = new ModalBuilder()
        .setCustomId("welcome_author_modal")
        .setTitle("Edit Welcome Author");

    const authorName = new TextInputBuilder()
        .setCustomId("author_name")
        .setLabel("Author Name")
        .setPlaceholder("Enter author name...")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(256);

    const authorURL = new TextInputBuilder()
        .setCustomId("author_url")
        .setLabel("Author URL")
        .setPlaceholder("https://example.com")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const authorIcon = new TextInputBuilder()
        .setCustomId("author_icon_url")
        .setLabel("Author Icon URL")
        .setPlaceholder("https://example.com/icon.png")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    return modal.addComponents(

        new ActionRowBuilder()
            .addComponents(authorName),

        new ActionRowBuilder()
            .addComponents(authorURL),

        new ActionRowBuilder()
            .addComponents(authorIcon)

    );
}