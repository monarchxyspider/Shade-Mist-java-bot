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

        if (interaction.isButton()) {

            const customId =
                interaction.customId;

            // ==================================================
            // WELCOME BUTTONS
            // ==================================================

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcome/welcomeButton");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Button Error:",
                        error
                    );

                    await sendError(
                        client,
                        interaction,
                        "Something went wrong while processing this button."
                    );
                }

                return;
            }


            // ==================================================
            // OTHER BUTTONS
            // ==================================================

            // Future ticket buttons etc.

            return;
        }


        // ==================================================
        // MODAL SUBMIT
        // ==================================================

        if (interaction.isModalSubmit()) {

            const customId =
                interaction.customId;

            // ==================================================
            // WELCOME MODALS
            // ==================================================

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcome/welcomeModals");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Modal Error:",
                        error
                    );

                    await sendError(
                        client,
                        interaction,
                        "Something went wrong while processing the form."
                    );
                }

                return;
            }

            return;
        }


        // ==================================================
        // CHANNEL SELECT MENU
        // ==================================================

        if (interaction.isChannelSelectMenu()) {

            const customId =
                interaction.customId;

            // ==================================================
            // WELCOME CHANNEL SELECT
            // ==================================================

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcome/welcomeSelects");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome Channel Select Error:",
                        error
                    );

                    await sendError(
                        client,
                        interaction,
                        "Something went wrong while processing the channel selector."
                    );
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

            // ==================================================
            // WELCOME SELECTS
            // ==================================================

            if (
                customId.startsWith("welcome_")
            ) {

                try {

                    const handler =
                        require("../utils/welcome/welcomeSelects");

                    await handler(
                        client,
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "Welcome String Select Error:",
                        error
                    );

                    await sendError(
                        client,
                        interaction,
                        "Something went wrong while processing the menu."
                    );
                }

                return;
            }

            return;
        }
    }
};


// ==========================================================
// ERROR RESPONSE
// ==========================================================

async function sendError(
    client,
    interaction,
    message
) {

    const reply = {
        content:
            `${client.config.emojis.error} ${message}`,
        ephemeral: true
    };

    try {

        if (
            interaction.replied ||
            interaction.deferred
        ) {

            await interaction.followUp(
                reply
            );

        } else {

            await interaction.reply(
                reply
            );
        }

    } catch {}
}