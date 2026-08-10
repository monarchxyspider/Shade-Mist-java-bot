const fs = require("fs");
const path = require("path");

// ==========================================
// FILE
// ==========================================

const dataFolder = path.join(
    process.cwd(),
    "data"
);

const configFile = path.join(
    dataFolder,
    "welcome.json"
);

// ==========================================
// CREATE FOLDER
// ==========================================

if (!fs.existsSync(dataFolder)) {

    fs.mkdirSync(dataFolder, {
        recursive: true
    });

}

// ==========================================
// CREATE FILE
// ==========================================

if (!fs.existsSync(configFile)) {

    fs.writeFileSync(
        configFile,
        JSON.stringify({}, null, 4)
    );

}

// ==========================================
// READ
// ==========================================

function getData() {

    try {

        return JSON.parse(
            fs.readFileSync(
                configFile,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "[Welcome] Failed to read data:",
            error
        );

        return {};

    }

}

// ==========================================
// SAVE
// ==========================================

function saveData(data) {

    fs.writeFileSync(
        configFile,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}

// ==========================================
// MODAL HANDLER
// ==========================================

module.exports = async (
    client,
    interaction
) => {

    try {

        if (!interaction.isModalSubmit()) {
            return;
        }

        // ======================================
        // AUTHOR
        // ======================================

        if (
            interaction.customId ===
            "welcome_author_modal"
        ) {

            const guild =
                interaction.guild;

            if (!guild) {

                return interaction.reply({
                    content:
                        `${client.config.emojis.error} This can only be used inside a server.`,
                    ephemeral: true
                });

            }

            const authorName =
                interaction.fields
                    .getTextInputValue(
                        "author_name"
                    )
                    .trim();

            const authorURL =
                interaction.fields
                    .getTextInputValue(
                        "author_url"
                    )
                    .trim();

            const authorIconURL =
                interaction.fields
                    .getTextInputValue(
                        "author_icon_url"
                    )
                    .trim();

            const data =
                getData();

            if (!data[guild.id]) {

                data[guild.id] = {

                    enabled: false,

                    channelId: null,

                    message: "",

                    dmMessage: "",

                    embed: {

                        color:
                            client.config.embedColor,

                        title: "",

                        description: "",

                        thumbnail: "",

                        image: "",

                        author: {

                            name: "",
                            url: "",
                            iconURL: ""

                        }

                    }

                };

            }

            if (!data[guild.id].embed) {

                data[guild.id].embed = {

                    color:
                        client.config.embedColor,

                    title: "",

                    description: "",

                    thumbnail: "",

                    image: "",

                    author: {

                        name: "",
                        url: "",
                        iconURL: ""

                    }

                };

            }

            data[guild.id].embed.author = {

                name: authorName,

                url: authorURL,

                iconURL: authorIconURL

            };

            saveData(data);

            return interaction.reply({
                content:
                    `${client.config.emojis.success} Welcome author settings have been saved successfully.`,
                ephemeral: true
            });

        }

    } catch (error) {

        console.error(
            "[modalHandler] Error:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({
                content:
                    `${client.config.emojis.error} Something went wrong while saving your settings.`,
                ephemeral: true
            }).catch(() => {});

        }

    }

};