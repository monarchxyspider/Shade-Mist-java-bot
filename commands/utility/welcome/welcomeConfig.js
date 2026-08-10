const fs = require("fs");
const path = require("path");

// ==================================================
// FILE LOCATION
// ==================================================

const dataFolder = path.join(
    process.cwd(),
    "data"
);

const configFile = path.join(
    dataFolder,
    "welcome.json"
);

// ==================================================
// DEFAULT CONFIG
// ==================================================

function createDefaultConfig(client) {

    return {
        enabled: false,

        channelId: null,

        message: "",

        embed: {
            color:
                client?.config?.embedColor ||
                "#ff0000",

            title: "",

            description: "",

            url: "",

            author: {
                name: "",
                url: "",
                iconURL: ""
            },

            thumbnail: "",

            image: "",

            footer: {
                text: "",
                iconURL: ""
            },

            timestamp: true
        },

        buttons: [],

        dmEnabled: false,

        dmMessage: ""
    };
}

// ==================================================
// ENSURE DATA FOLDER
// ==================================================

function ensureDataFolder() {

    if (!fs.existsSync(dataFolder)) {

        fs.mkdirSync(
            dataFolder,
            {
                recursive: true
            }
        );
    }

}

// ==================================================
// LOAD ALL CONFIGS
// ==================================================

function loadWelcomeConfigs(client) {

    ensureDataFolder();

    if (!fs.existsSync(configFile)) {

        fs.writeFileSync(
            configFile,
            "{}",
            "utf8"
        );

        return new Map();
    }

    try {

        const raw =
            fs.readFileSync(
                configFile,
                "utf8"
            );

        if (!raw.trim()) {

            return new Map();
        }

        const data =
            JSON.parse(raw);

        const map =
            new Map();

        for (
            const [guildId, config]
            of Object.entries(data)
        ) {

            map.set(
                guildId,
                config
            );
        }

        return map;

    } catch (error) {

        console.error(
            "Failed to load welcome.json:",
            error
        );

        return new Map();
    }
}

// ==================================================
// SAVE ALL CONFIGS
// ==================================================

function saveWelcomeConfigs(client) {

    ensureDataFolder();

    try {

        const data =
            Object.fromEntries(
                client.welcomeConfigs || new Map()
            );

        fs.writeFileSync(
            configFile,
            JSON.stringify(
                data,
                null,
                4
            ),
            "utf8"
        );

    } catch (error) {

        console.error(
            "Failed to save welcome.json:",
            error
        );
    }
}

// ==================================================
// GET CONFIG
// ==================================================

function getWelcomeConfig(
    client,
    guildId
) {

    if (!client.welcomeConfigs) {

        client.welcomeConfigs =
            new Map();
    }

    let config =
        client.welcomeConfigs.get(
            guildId
        );

    if (!config) {

        config =
            createDefaultConfig(
                client
            );

        client.welcomeConfigs.set(
            guildId,
            config
        );

        saveWelcomeConfigs(
            client
        );
    }

    return config;
}

// ==================================================
// SAVE ONE GUILD
// ==================================================

function saveGuildWelcomeConfig(
    client,
    guildId
) {

    if (!client.welcomeConfigs) {

        client.welcomeConfigs =
            new Map();
    }

    saveWelcomeConfigs(
        client
    );

    return client.welcomeConfigs.get(
        guildId
    );
}

// ==================================================
// DELETE ONE GUILD
// ==================================================

function deleteWelcomeConfig(
    client,
    guildId
) {

    if (!client.welcomeConfigs) {
        return;
    }

    client.welcomeConfigs.delete(
        guildId
    );

    saveWelcomeConfigs(
        client
    );
}

// ==================================================
// EXPORT
// ==================================================

module.exports = {
    configFile,
    createDefaultConfig,
    loadWelcomeConfigs,
    saveWelcomeConfigs,
    getWelcomeConfig,
    saveGuildWelcomeConfig,
    deleteWelcomeConfig
};