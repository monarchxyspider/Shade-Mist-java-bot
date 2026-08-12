const { Events } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,

    async execute(client, interaction) {

        try {

            // ==========================================
            // BUTTON INTERACTION
            // ==========================================

            if (interaction.isButton()) {

                // Only handle welcome buttons
                if (
                    interaction.customId.startsWith("welcome_")
                ) {

                    if (!client.buttonHandler) {

                        return interaction.reply({
                            content:
                                `${client.config.emojis.error} Button handler is not available.`,
                            ephemeral: true
                        }).catch(() => {});
                    }

                    return await client.buttonHandler(
                        client,
                        interaction
                    );
                }

                return;
            }


            // ==========================================
            // MODAL INTERACTION
            // ==========================================

            if (interaction.isModalSubmit()) {

                if (
                    interaction.customId.startsWith("welcome_")
                ) {

                    if (!client.modalHandler) {

                        return interaction.reply({
                            content:
                                `${client.config.emojis.error} Modal handler is not available.`,
                            ephemeral: true
                        }).catch(() => {});
                    }

                    return await client.modalHandler(
                        client,
                        interaction
                    );
                }

                return;
            }


        } catch (error) {

            console.error(
                "[InteractionCreate] Error:",
                error
            );


            // ==========================================
            // SAFE ERROR RESPONSE
            // ==========================================

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