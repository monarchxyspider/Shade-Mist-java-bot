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

                    if (!client.buttonHandler) {

                        return interaction.reply({
                            content:
                                `${client.config.emojis.error} Button handler is not loaded.`,
                            ephemeral: true
                        });
                    }

                    return client.buttonHandler(
                        client,
                        interaction
                    );
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

                    if (!client.modalHandler) {

                        return interaction.reply({
                            content:
                                `${client.config.emojis.error} Modal handler is not loaded yet.`,
                            ephemeral: true
                        });
                    }

                    return client.modalHandler(
                        client,
                        interaction
                    );
                }

                return;
            }


        } catch (error) {

            console.error(
                "[interactionCreate] Error:",
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
                    `${client.config.emojis.error} Something went wrong while processing this interaction.`,

                ephemeral: true

            }).catch(() => {});

        }

    }

};