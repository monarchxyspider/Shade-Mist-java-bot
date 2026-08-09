const {
    ButtonInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction
} = require("discord.js");

module.exports = (client) => {

    // ==================================================
    // BUTTON HANDLER
    // ==================================================

    client.on("interactionCreate", async interaction => {

        // Ignore normal commands
        if (
            !interaction.isButton() &&
            !interaction.isModalSubmit() &&
            !interaction.isStringSelectMenu()
        ) {
            return;
        }

        try {

            // ==================================================
            // BUTTONS
            // ==================================================

            if (interaction.isButton()) {

                const customId = interaction.customId;

                // ----------------------------------------------
                // WELCOME BUTTONS
                // ----------------------------------------------

                if (customId.startsWith("welcome_")) {

                    const welcomeHandler =
                        require("../utils/welcomeButtons");

                    return welcomeHandler(
                        client,
                        interaction
                    );
                }

                // ----------------------------------------------
                // OTHER BUTTONS
                // ----------------------------------------------

                // Future buttons can be added here.
                //
                // Example:
                //
                // if (customId.startsWith("ticket_")) {
                //
                //     const ticketHandler =
                //         require("../utils/ticketButtons");
                //
                //     return ticketHandler(
                //         client,
                //         interaction
                //     );
                // }

                return;
            }

            // ==================================================
            // MODALS
            // ==================================================

            if (interaction.isModalSubmit()) {

                const customId = interaction.customId;

                // ----------------------------------------------
                // WELCOME MODALS
                // ----------------------------------------------

                if (customId.startsWith("welcome_")) {

                    const welcomeModalHandler =
                        require("../utils/welcomeModals");

                    return welcomeModalHandler(
                        client,
                        interaction
                    );
                }

                return;
            }

            // ==================================================
            // STRING SELECT MENUS
            // ==================================================

            if (interaction.isStringSelectMenu()) {

                const customId = interaction.customId;

                // ----------------------------------------------
                // WELCOME SELECT MENUS
                // ----------------------------------------------

                if (customId.startsWith("welcome_")) {

                    const welcomeSelectHandler =
                        require("../utils/welcomeSelects");

                    return welcomeSelectHandler(
                        client,
                        interaction
                    );
                }

                return;
            }

        } catch (error) {

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            console.error(
                "INTERACTION HANDLER ERROR"
            );

            console.error(
                error
            );

            console.error(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );

            // ----------------------------------------------
            // SEND ERROR TO USER
            // ----------------------------------------------

            try {

                const response = {
                    content:
                        `${client.config.emojis.error} **Something went wrong while processing this interaction.**`
                };

                if (interaction.replied) {

                    await interaction.followUp(response);

                } else if (interaction.deferred) {

                    await interaction.editReply(response);

                } else {

                    await interaction.reply(response);

                }

            } catch {}
        }
    });

    console.log("✔ Button Handler Loaded");
};