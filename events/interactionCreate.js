const {
    Events
} = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(client, interaction) {

        // ==================================================
        // SLASH COMMAND
        // ==================================================

        if (interaction.isChatInputCommand()) {

            const command =
                client.commands.get(
                    interaction.commandName
                );

            if (!command) return;

            try {

                await command.execute(
                    client,
                    interaction,
                    []
                );

            } catch (error) {

                console.error(
                    `Slash Command Error [${interaction.commandName}]:`,
                    error
                );

                const reply = {
                    content:
                        `${client.config.emojis.error} **Something went wrong while executing this command.**`,
                    ephemeral: true
                };

                try {

                    if (interaction.replied) {

                        await interaction.followUp(reply);

                    } else if (interaction.deferred) {

                        await interaction.editReply(reply);

                    } else {

                        await interaction.reply(reply);
                    }

                } catch {}
            }

            return;
        }

        // ==================================================
        // AUTOCOMPLETE
        // ==================================================

        if (interaction.isAutocomplete()) {

            const command =
                client.commands.get(
                    interaction.commandName
                );

            if (!command?.autocomplete) return;

            try {

                await command.autocomplete(
                    client,
                    interaction
                );

            } catch (error) {

                console.error(
                    `Autocomplete Error [${interaction.commandName}]:`,
                    error
                );
            }

            return;
        }

        // ==================================================
        // BUTTONS
        // ==================================================
        // Welcome buttons, ticket buttons, etc.
        // Ye IDs baad mein hum handlers mein use karenge.

        if (interaction.isButton()) {

            const customId =
                interaction.customId;

            // ----------------------------------------------
            // WELCOME BUTTONS
            // ----------------------------------------------

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcomeButtons");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Button Error:",
                        error
                    );

                    if (!interaction.replied) {

                        try {

                            await interaction.reply({
                                content:
                                    `${client.config.emojis.error} Something went wrong while processing this button.`,
                                ephemeral: true
                            });

                        } catch {}
                    }
                }

                return;
            }

            // ----------------------------------------------
            // OTHER BUTTONS
            // ----------------------------------------------

            // Future:
            //
            // if (customId.startsWith("ticket_")) {
            //     ...
            // }

            return;
        }

        // ==================================================
        // MODAL SUBMIT
        // ==================================================

        if (interaction.isModalSubmit()) {

            const customId =
                interaction.customId;

            // ----------------------------------------------
            // WELCOME MODALS
            // ----------------------------------------------

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcomeModals");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Modal Error:",
                        error
                    );

                    if (!interaction.replied) {

                        try {

                            await interaction.reply({
                                content:
                                    `${client.config.emojis.error} Something went wrong while processing the form.`,
                                ephemeral: true
                            });

                        } catch {}
                    }
                }

                return;
            }

            return;
        }

        // ==================================================
        // STRING SELECT MENU
        // ==================================================

        if (interaction.isStringSelectMenu()) {

            const customId =
                interaction.customId;

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcomeSelects");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Select Error:",
                        error
                    );

                    if (!interaction.replied) {

                        try {

                            await interaction.reply({
                                content:
                                    `${client.config.emojis.error} Something went wrong while processing the menu.`,
                                ephemeral: true
                            });

                        } catch {}
                    }
                }

                return;
            }

            return;
        }
    }
};