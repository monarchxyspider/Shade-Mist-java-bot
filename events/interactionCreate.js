const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(client, interaction) {

        try {

            // ==============================
            // BUTTONS
            // ==============================

            if (interaction.isButton()) {

                // Welcome buttons
                if (interaction.customId.startsWith("welcome_")) {

                    // Button handler baad mein yahan connect hoga
                    if (client.buttonHandler) {
                        return client.buttonHandler(client, interaction);
                    }

                    return;
                }

                return;
            }

            // ==============================
            // MODALS
            // ==============================

            if (interaction.isModalSubmit()) {

                // Welcome modals
                if (interaction.customId.startsWith("welcome_")) {

                    // Modal handler baad mein yahan connect hoga
                    if (client.modalHandler) {
                        return client.modalHandler(client, interaction);
                    }

                    return;
                }

                return;
            }

            // ==============================
            // SELECT MENUS
            // ==============================

            if (interaction.isStringSelectMenu()) {

                if (interaction.customId.startsWith("welcome_")) {

                    // Select menu handler baad mein connect hoga
                    if (client.selectMenuHandler) {
                        return client.selectMenuHandler(client, interaction);
                    }

                    return;
                }

                return;
            }

        } catch (error) {

            console.error(
                "[interactionCreate] Error:",
                error
            );

            // Interaction ko dobara reply karne ki koshish nahi karni
            // agar already acknowledge ho chuki ho.

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ Something went wrong while processing this interaction.",
                    ephemeral: true
                }).catch(() => {});

            }

        }
    }
};