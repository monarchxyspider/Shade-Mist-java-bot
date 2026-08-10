const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(client, interaction) {

        try {

            // ==========================================
            // BUTTON
            // ==========================================

            if (interaction.isButton()) {

                if (
                    interaction.customId.startsWith("welcome_")
                ) {

                    if (client.buttonHandler) {
                        return client.buttonHandler(
                            client,
                            interaction
                        );
                    }

                }

                return;
            }

            // ==========================================
            // MODAL
            // ==========================================

            if (interaction.isModalSubmit()) {

                if (
                    interaction.customId.startsWith("welcome_")
                ) {

                    if (client.modalHandler) {
                        return client.modalHandler(
                            client,
                            interaction
                        );
                    }

                }

                return;
            }

        } catch (error) {

            console.error(
                "[interactionCreate] Error:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content:
                        `${client.config.emojis.error} Something went wrong while processing this interaction.`,
                    ephemeral: true
                }).catch(() => {});

            }

        }
    }
};