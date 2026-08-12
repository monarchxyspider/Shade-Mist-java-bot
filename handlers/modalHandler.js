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
// CREATE FOLDER + FILE
// ==========================================

function ensureDataFile() {

    if (!fs.existsSync(dataFolder)) {

        fs.mkdirSync(dataFolder, {
            recursive: true
        });

    }

    if (!fs.existsSync(configFile)) {

        fs.writeFileSync(
            configFile,
            JSON.stringify({}, null, 4)
        );

    }

}


// ==========================================
// READ DATA
// ==========================================

function getData() {

    ensureDataFile();

    try {

        const raw =
            fs.readFileSync(
                configFile,
                "utf8"
            );

        if (!raw.trim()) {
            return {};
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "[Welcome] Failed to read data:",
            error
        );

        return {};

    }

}


// ==========================================
// SAVE DATA
// ==========================================

function saveData(data) {

    ensureDataFile();

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
// DEFAULT SERVER DATA
// ==========================================

function createServerData(client) {

    return {

        enabled: false,

        channelId: null,

        dmEnabled: false,

        background: null,

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

            },

            footer: {

                text: "",

                iconURL: ""

            },

            timestamp: false

        }

    };

}


// ==========================================
// GET SERVER
// ==========================================

function getServerData(
    client,
    data,
    guildId
) {

    if (!data[guildId]) {

        data[guildId] =
            createServerData(client);

    }


    // Make sure embed exists
    if (!data[guildId].embed) {

        data[guildId].embed =
            createServerData(client).embed;

    }


    // Make sure author exists
    if (!data[guildId].embed.author) {

        data[guildId].embed.author = {

            name: "",
            url: "",
            iconURL: ""

        };

    }


    return data[guildId];

}


// ==========================================
// GET FIELD SAFELY
// ==========================================

function getField(
    interaction,
    id
) {

    try {

        return interaction.fields
            .getTextInputValue(id)
            .trim();

    } catch {

        return "";

    }

}


// ==========================================
// VALIDATE HEX COLOR
// ==========================================

function isValidColor(color) {

    return /^#[0-9A-F]{6}$/i.test(
        color
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
        // SERVER CHECK
        // ======================================

        if (!interaction.guild) {

            return interaction.reply({

                content:
                    `${client.config.emojis.error} This can only be used inside a server.`,

                ephemeral: true

            });

        }


        const guildId =
            interaction.guild.id;


        const data =
            getData();


        const serverData =
            getServerData(
                client,
                data,
                guildId
            );


        const id =
            interaction.customId;


        // ======================================
        // AUTHOR
        // ======================================

        if (
            id === "welcome_author_modal"
        ) {

            const authorName =
                getField(
                    interaction,
                    "author_name"
                );


            const authorURL =
                getField(
                    interaction,
                    "author_url"
                );


            const authorIconURL =
                getField(
                    interaction,
                    "author_icon_url"
                );


            serverData.embed.author = {

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


        // ======================================
        // WELCOME TEXT
        // ======================================

        if (
            id === "welcome_text_modal"
        ) {

            const text =
                getField(
                    interaction,
                    "welcome_text"
                );


            serverData.message =
                text;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome message has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // DESCRIPTION
        // ======================================

        if (
            id === "welcome_description_modal"
        ) {

            const description =
                getField(
                    interaction,
                    "description"
                );


            serverData.embed.description =
                description;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome embed description has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // TITLE
        // ======================================

        if (
            id === "welcome_title_modal"
        ) {

            const title =
                getField(
                    interaction,
                    "title"
                );


            serverData.embed.title =
                title;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome embed title has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // THUMBNAIL
        // ======================================

        if (
            id === "welcome_thumbnail_modal"
        ) {

            const thumbnail =
                getField(
                    interaction,
                    "thumbnail"
                );


            serverData.embed.thumbnail =
                thumbnail;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome thumbnail has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // IMAGE
        // ======================================

        if (
            id === "welcome_image_modal"
        ) {

            const image =
                getField(
                    interaction,
                    "image"
                );


            serverData.embed.image =
                image;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome image has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // EMBED COLOUR
        // ======================================

        if (
            id === "welcome_color_modal"
        ) {

            const color =
                getField(
                    interaction,
                    "color"
                );


            if (
                color &&
                !isValidColor(color)
            ) {

                return interaction.reply({

                    content:
                        `${client.config.emojis.error} Invalid colour. Please use a HEX colour such as \`#E53935\`.`,

                    ephemeral: true

                });

            }


            if (color) {

                serverData.embed.color =
                    color;

            } else {

                serverData.embed.color =
                    client.config.embedColor;

            }


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome embed colour has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // BACKGROUND
        // ======================================

        if (
            id === "welcome_background_modal"
        ) {

            const background =
                getField(
                    interaction,
                    "background"
                );


            serverData.background =
                background || null;


            saveData(data);


            return interaction.reply({

                content:
                    `${client.config.emojis.success} Welcome background has been saved successfully.`,

                ephemeral: true

            });

        }


        // ======================================
        // UNKNOWN MODAL
        // ======================================

        return interaction.reply({

            content:
                `${client.config.emojis.error} This welcome form is not configured yet.`,

            ephemeral: true

        });


    } catch (error) {

        console.error(
            "[modalHandler] Error:",
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
                `${client.config.emojis.error} Something went wrong while saving your settings.`,

            ephemeral: true

        }).catch(() => {});

    }

};