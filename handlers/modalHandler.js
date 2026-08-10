const fs = require("fs");
const path = require("path");

const dataFolder = path.join(process.cwd(), "data");
const configFile = path.join(dataFolder, "welcome.json");

// ==========================================
// MAKE SURE DATA EXISTS
// ==========================================

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

// ==========================================
// READ DATA
// ==========================================

function getWelcomeData() {

    try {

        return JSON.parse(
            fs.readFileSync(configFile, "utf8")
        );

    } catch (error) {

        console.error(
            "[Welcome] Failed to read welcome.json:",
            error
        );

        return {};
    }
}

// ==========================================
// SAVE DATA
// ==========================================

function saveWelcomeData(data) {

    fs.writeFileSync(
        configFile,
        JSON.stringify(data, null, 4)
    );
}

// ==========================================
// MODAL HANDLER
// ==========================================

module.exports = async (client, interaction) => {

    try {

        // ======================================
        // ONLY MODALS
        // ======================================

        if (!interaction.isModalSubmit()) {
            return;
        }

        // ======================================
        // AUTHOR MODAL
        // ======================================

        if (
            interaction.customId ===
            "welcome_author_modal"
        ) {

            const guild = interaction.guild;

            if (!guild) {
                return interaction.reply({
                    content: `${client.config.emojis.error} This can only be used inside a server.`,
                    ephemeral: true
                });
            }

            // ==================================
            // GET VALUES
            // ==================================

            const authorName =
                interaction.fields.getTextInputValue(
                    "author_name"
                ).trim();

            const authorURL =
                interaction.fields.getTextInputValue(
                    "author_url"
                ).trim();

            const authorIconURL =
                interaction.fields.getTextInputValue(
                    "author_icon_url"
                ).trim();

            // ==================================
            // LOAD DATA
            // ==================================

            const welcomeData =
                getWelcomeData();

            // ==================================
            // CREATE SERVER DATA
            // ==================================

            if (!welcomeData[guild.id]) {

                welcomeData[guild.id] = {
                    enabled: false,
                    channelId: null,
                    message: "",
                    dmMessage: "",
                    embed: {
                        color: client.config.embedColor,
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

            // ==================================
            // MAKE SURE EMBED EXISTS
            // ==================================

            if (!welcomeData[guild.id].embed) {

                welcomeData[guild.id].embed = {
                    color: client.config.embedColor,
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

            // ==================================
            // SAVE AUTHOR
            // ==================================

            welcomeData[guild.id].embed.author = {
                name: authorName,
                url: authorURL,
                iconURL: authorIconURL
            };

            saveWelcomeData(welcomeData);

            // ==================================
            // SUCCESS
            // ==================================

            return interaction.reply({
                content:
                    `${client.config.emojis.success} Welcome embed author has been updated successfully.`,
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

            return interaction.reply({
                content:
                    `${client.config.emojis.error} Something went wrong while saving the author settings.`,
                ephemeral: true
            }).catch(() => {});
        }
    }
};