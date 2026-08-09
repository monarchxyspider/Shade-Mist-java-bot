const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "welcome.json");

function ensureStorage() {
if (!fs.existsSync(DATA_DIR)) {
fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 4));
}

}

function loadAll() {
ensureStorage();

try {
    return JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );
} catch {
    return {};
}

}

function saveAll(data) {
ensureStorage();

fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 4)
);

}

function getDefaultConfig() {
return {
enabled: false,

    channelId: null,

    dmEnabled: false,

    dmMessage:
        "Welcome {user.mention} to **{guild.name}**!",

    message:
        "Welcome {user.mention} to **{guild.name}**!",

    embed: {
        enabled: true,

        color: "#5865F2",

        title: "Welcome!",

        description:
            "Welcome {user.mention} to **{guild.name}**!",

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

    buttons: []
};

}

function getConfig(guildId) {
const all = loadAll();

if (!all[guildId]) {
    all[guildId] = getDefaultConfig();
    saveAll(all);
}

return all[guildId];

}

function saveConfig(guildId, config) {
const all = loadAll();

all[guildId] = config;

saveAll(all);

return config;

}

function updateConfig(guildId, updates) {
const current = getConfig(guildId);

const updated = deepMerge(
    current,
    updates
);

saveConfig(
    guildId,
    updated
);

return updated;

}

function resetConfig(guildId) {
const all = loadAll();

all[guildId] = getDefaultConfig();

saveAll(all);

return all[guildId];

}

function deepMerge(target, source) {
const output = {
...target
};

for (const key of Object.keys(source)) {

    if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        typeof output[key] === "object" &&
        output[key] !== null
    ) {
        output[key] = deepMerge(
            output[key],
            source[key]
        );
    } else {
        output[key] = source[key];
    }
}

return output;

}

function setEnabled(guildId, enabled) {
return updateConfig(
guildId,
{
enabled: Boolean(enabled)
}
);
}

function setChannel(guildId, channelId) {
return updateConfig(
guildId,
{
channelId
}
);
}

function setMessage(guildId, message) {
return updateConfig(
guildId,
{
message
}
);
}

function setDMMessage(guildId, message) {
return updateConfig(
guildId,
{
dmMessage: message
}
);
}

function setDMEnabled(guildId, enabled) {
return updateConfig(
guildId,
{
dmEnabled: Boolean(enabled)
}
);
}

function getWelcomeChannel(guild) {
const config = getConfig(guild.id);

if (!config.channelId) {
    return null;
}

return guild.channels.cache.get(
    config.channelId
) || null;

}

module.exports = {
ensureStorage,
loadAll,
saveAll,
getDefaultConfig,
getConfig,
saveConfig,
updateConfig,
resetConfig,
setEnabled,
setChannel,
setMessage,
setDMMessage,
setDMEnabled,
getWelcomeChannel
};