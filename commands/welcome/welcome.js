const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ==================================================
// DATA
// ==================================================

const dataFolder = path.join(process.cwd(), "data");
const dataFile = path.join(dataFolder, "welcome.json");


// ==================================================
// DEFAULT GUILD DATA
// ==================================================

function defaultGuildData() {

    return {

        enabled: false,

        channelId: null,

        dmEnabled: false,

        background: null,

        messages: {

            message1: {
                enabled: true,
                type: "embed",

                content: "",

                embed: {
                    author: {
                        name: "",
                        url: "",
                        iconURL: ""
                    },

                    title: "",
                    description: "",
                    color: "#E53935",

                    thumbnail: "",
                    image: "",

                    footer: {
                        text: "",
                        iconURL: ""
                    },

                    timestamp: false
                }
            },

            message2: {
                enabled: false,
                type: "embed",

                content: "",

                embed: {
                    author: {
                        name: "",
                        url: "",
                        iconURL: ""
                    },

                    title: "",
                    description: "",
                    color: "#E53935",

                    thumbnail: "",
                    image: "",

                    footer: {
                        text: "",
                        iconURL: ""
                    },

                    timestamp: false
                }
            },

            message3: {
                enabled: false,
                type: "embed",

                content: "",

                embed: {
                    author: {
                        name: "",
                        url: "",
                        iconURL: ""
                    },

                    title: "",
                    description: "",
                    color: "#E53935",

                    thumbnail: "",
                    image: "",

                    footer: {
                        text: "",
                        iconURL: ""
                    },

                    timestamp: false
                }
            },

            dm: {
                enabled: false,
                type: "embed",

                content: "",

                embed: {
                    author: {
                        name: "",
                        url: "",
                        iconURL: ""
                    },

                    title: "",
                    description: "",
                    color: "#E53935",

                    thumbnail: "",
                    image: "",

                    footer: {
                        text: "",
                        iconURL: ""
                    },

                    timestamp: false
                }
            }

        }

    };
}


// ==================================================
// LOAD DATA
// ==================================================

function loadData() {

    try {

        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder, {
                recursive: true
            });
        }

        if (!fs.existsSync(dataFile)) {

            fs.writeFileSync(
                dataFile,
                JSON.stringify({}, null, 4)
            );

            return {};
        }

        const raw =
            fs.readFileSync(
                dataFile,
                "utf8"
            );

        return raw.trim()
            ? JSON.parse(raw)
            : {};

    } catch (error) {

        console.error(
            "Welcome data load error:",
            error
        );

        return {};
    }
}


// ==================================================
// SAVE DATA
// ==================================================

function saveData(data) {

    try {

        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder, {
                recursive: true
            });
        }

        fs.writeFileSync(
            dataFile,
            JSON.stringify(data, null, 4)
        );

        return true;

    } catch (error) {

        console.error(
            "Welcome data save error:",
            error
        );

        return false;
    }
}


// ==================================================
// GET GUILD CONFIG
// ==================================================

function getGuildConfig(guildId) {

    const data = loadData();

    if (!data[guildId]) {

        data[guildId] =
            defaultGuildData();

        saveData(data);
    }

    return data[guildId];
}


// ==================================================
// UPDATE GUILD CONFIG
// ==================================================

function updateGuildConfig(
    guildId,
    callback
) {

    const data = loadData();

    if (!data[guildId]) {
        data[guildId] =
            defaultGuildData();
    }

    callback(data[guildId]);

    saveData(data);

    return data[guildId];
}


// ==================================================
// COMMAND
// ==================================================

module.exports = {

    name: "welcome",

    aliases: [],

    description:
        "Configure the welcome system.",


    async execute(
        client,
        message,
        args
    ) {

        // ==========================================
        // SERVER CHECK
        // ==========================================

        if (!message.guild) {

            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }


        // ==========================================
        // GET CONFIG
        // ==========================================

        const config =
            getGuildConfig(
                message.guild.id
            );


        // ==========================================
        // NO SUBCOMMAND
        // ==========================================

        if (!args[0]) {

            return sendMainPanel(
                client,
                message,
                config
            );
        }


        const sub =
            args[0].toLowerCase();


        // ==========================================
        // CONFIG
        // ==========================================

        if (sub === "config") {

            return sendMainPanel(
                client,
                message,
                config
            );
        }


        // ==========================================
        // ENABLE
        // ==========================================

        if (sub === "enable") {

            updateGuildConfig(
                message.guild.id,
                guild => {

                    guild.enabled = true;
                }
            );

            return sendSuccess(
                client,
                message,
                "Welcome system has been enabled."
            );
        }


        // ==========================================
        // DISABLE
        // ==========================================

        if (sub === "disable") {

            updateGuildConfig(
                message.guild.id,
                guild => {

                    guild.enabled = false;
                }
            );

            return sendSuccess(
                client,
                message,
                "Welcome system has been disabled."
            );
        }


        // ==========================================
        // CHANNEL
        // ==========================================

        if (sub === "channel") {

            const channel =
                message.mentions.channels.first();

            if (!channel) {

                return message.reply({
                    content:
                        `${client.config.emojis.error} Please mention a channel.\n\nExample: \`s!welcome channel #welcome\``
                });
            }


            updateGuildConfig(
                message.guild.id,
                guild => {

                    guild.channelId =
                        channel.id;
                }
            );


            const embed =
                new EmbedBuilder()

                    .setColor(
                        client.config.embedColor
                    )

                    .setAuthor({
                        name:
                            `${client.config.botName} • Welcome Channel`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })

                    .setTitle(
                        "Welcome Channel Updated"
                    )

                    .setDescription(
                        [
                            `${client.config.emojis.success} **Welcome channel has been updated successfully.**`,
                            "",
                            `${client.config.emojis.place} **Channel**`,
                            `> ${channel}`,
                            "",
                            `${client.config.emojis.fetch} **Channel ID**`,
                            `> \`${channel.id}\``
                        ].join("\n")
                    )

                    .setFooter({
                        text:
                            `${client.config.botName} • Welcome System`
                    })

                    .setTimestamp();


            return message.reply({
                embeds: [embed]
            });
        }


        // ==========================================
        // TEST
        // ==========================================

        if (sub === "test") {

            return testWelcome(
                client,
                message
            );
        }


        // ==========================================
        // VARIABLES
        // ==========================================

        if (sub === "variables") {

            return sendVariables(
                client,
                message
            );
        }


        // ==========================================
        // HELP
        // ==========================================

        if (sub === "help") {

            return sendHelp(
                client,
                message
            );
        }


        // ==========================================
        // UNKNOWN
        // ==========================================

        return message.reply({
            content:
                `${client.config.emojis.error} Unknown welcome command.\nUse \`s!welcome help\` to see all available commands.`
        });
    }
};


// ==================================================
// MAIN PANEL
// ==================================================

async function sendMainPanel(
    client,
    message,
    config
) {

    const status =
        config.enabled
            ? `${client.config.emojis.statusOnline} **Enabled**`
            : `${client.config.emojis.statusOffline} **Disabled**`;


    const dmStatus =
        config.dmEnabled
            ? `${client.config.emojis.statusOnline} **Enabled**`
            : `${client.config.emojis.statusOffline} **Disabled**`;


    let channelText =
        "Not configured";


    if (config.channelId) {

        const channel =
            message.guild.channels.cache.get(
                config.channelId
            );

        channelText =
            channel
                ? `${channel}`
                : `\`${config.channelId}\``;
    }


    const message1 =
        config.messages.message1.enabled
            ? "Configured"
            : "Not configured";


    const message2 =
        config.messages.message2.enabled
            ? "Configured"
            : "Not configured";


    const message3 =
        config.messages.message3.enabled
            ? "Configured"
            : "Not configured";


    const dm =
        config.messages.dm.enabled
            ? "Configured"
            : "Not configured";


    const embed =
        new EmbedBuilder()

            .setColor(
                config.enabled
                    ? client.config.embedColor
                    : "#555555"
            )

            .setAuthor({
                name:
                    `${client.config.botName} • Welcome System`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setTitle(
                "Welcome Configuration"
            )

            .setDescription(
                [
                    "Configure your server's welcome system from this panel.",
                    "",
                    `${client.config.emojis.stats} **Status**`,
                    `> ${status}`,
                    "",
                    `${client.config.emojis.message} **Welcome Channel**`,
                    `> ${channelText}`,
                    "",
                    `${client.config.emojis.message} **DM**`,
                    `> ${dmStatus}`,
                    "",
                    `${client.config.emojis.message} **Message 1**`,
                    `> ${message1}`,
                    "",
                    `${client.config.emojis.message} **Message 2**`,
                    `> ${message2}`,
                    "",
                    `${client.config.emojis.message} **Message 3**`,
                    `> ${message3}`,
                    "",
                    `${client.config.emojis.message} **DM Message**`,
                    `> ${dm}`
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })

            .setTimestamp();


    // ==========================================
    // ROW 1
    // ==========================================

    const row1 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        config.enabled
                            ? "welcome_disable"
                            : "welcome_enable"
                    )

                    .setLabel(
                        config.enabled
                            ? "Disable Welcome"
                            : "Enable Welcome"
                    )

                    .setEmoji(
                        config.enabled
                            ? client.config.emojis.statusOffline
                            : client.config.emojis.statusOnline
                    )

                    .setStyle(
                        config.enabled
                            ? ButtonStyle.Danger
                            : ButtonStyle.Primary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "welcome_edit_embed"
                    )

                    .setLabel(
                        "Edit Embed"
                    )

                    .setEmoji(
                        client.config.emojis.gear
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );


    // ==========================================
    // ROW 2
    // ==========================================

    const row2 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        config.dmEnabled
                            ? "welcome_dm_disable"
                            : "welcome_dm_enable"
                    )

                    .setLabel(
                        config.dmEnabled
                            ? "DM: ON"
                            : "DM: OFF"
                    )

                    .setEmoji(
                        client.config.emojis.message
                    )

                    .setStyle(
                        config.dmEnabled
                            ? ButtonStyle.Success
                            : ButtonStyle.Secondary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "welcome_variables"
                    )

                    .setLabel(
                        "Variables"
                    )

                    .setEmoji(
                        client.config.emojis.list
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );


    // ==========================================
    // ROW 3
    // ==========================================

    const row3 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "welcome_test_all"
                    )

                    .setLabel(
                        "Test All"
                    )

                    .setEmoji(
                        client.config.emojis.place
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "welcome_background"
                    )

                    .setLabel(
                        "Change BG"
                    )

                    .setEmoji(
                        client.config.emojis.gear
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );


    // ==========================================
    // ROW 4
    // ==========================================

    const row4 =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "welcome_message_select"
                    )

                    .setLabel(
                        "Select a message to configure"
                    )

                    .setEmoji(
                        client.config.emojis.message
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )
            );


    return message.reply({

        embeds: [
            embed
        ],

        components: [
            row1,
            row2,
            row3,
            row4
        ]
    });
}


// ==================================================
// VARIABLES
// ==================================================

async function sendVariables(
    client,
    message
) {

    const embed =
        new EmbedBuilder()

            .setColor(
                client.config.embedColor
            )

            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Variables`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setTitle(
                "Welcome Variables"
            )

            .setDescription(
                [
                    "Use these variables inside your welcome messages.",
                    "",
                    "**USER**",
                    "",
                    "`{user.mention}`",
                    "> Mentions the new member.",
                    "",
                    "`{user.id}`",
                    "> User ID.",
                    "",
                    "`{user.name}`",
                    "> Username.",
                    "",
                    "`{user.username}`",
                    "> Discord username.",
                    "",
                    "`{user.tag}`",
                    "> User tag.",
                    "",
                    "`{user.avatar}`",
                    "> User avatar URL.",
                    "",
                    "`{user.avatar.url}`",
                    "> User avatar URL.",
                    "",
                    "`{user.joinat}`",
                    "> Member join date.",
                    "",
                    "`{user.createdat}`",
                    "> Account creation date.",
                    "",
                    "**GUILD**",
                    "",
                    "`{guild.id}`",
                    "> Server ID.",
                    "",
                    "`{guild.name}`",
                    "> Server name.",
                    "",
                    "`{guild.icon}`",
                    "> Server icon URL.",
                    "",
                    "`{guild.icon.url}`",
                    "> Server icon URL.",
                    "",
                    "`{guild.owner}`",
                    "> Server owner.",
                    "",
                    "`{guild.members}`",
                    "> Total member count.",
                    "",
                    "`{guild.members.bot}`",
                    "> Total bot count.",
                    "",
                    "**CHANNEL**",
                    "",
                    "`{channel.id}`",
                    "> Channel ID.",
                    "",
                    "`{channel.name}`",
                    "> Channel name.",
                    "",
                    "**TIME**",
                    "",
                    "`{timestamp}`",
                    "> Current Discord timestamp.",
                    "",
                    "`{date}`",
                    "> Current date.",
                    "",
                    "`{time}`",
                    "> Current time."
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })

            .setTimestamp();


    return message.reply({
        embeds: [
            embed
        ]
    });
}


// ==================================================
// HELP
// ==================================================

async function sendHelp(
    client,
    message
) {

    const embed =
        new EmbedBuilder()

            .setColor(
                client.config.embedColor
            )

            .setAuthor({
                name:
                    `${client.config.botName} • Welcome Help`,
                iconURL:
                    client.user.displayAvatarURL()
            })

            .setTitle(
                "Welcome Commands"
            )

            .setDescription(
                [
                    "`s!welcome`",
                    "> Open the welcome configuration panel.",
                    "",
                    "`s!welcome config`",
                    "> Open the configuration panel.",
                    "",
                    "`s!welcome enable`",
                    "> Enable the welcome system.",
                    "",
                    "`s!welcome disable`",
                    "> Disable the welcome system.",
                    "",
                    "`s!welcome channel #channel`",
                    "> Set the welcome channel.",
                    "",
                    "`s!welcome test`",
                    "> Test the configured welcome message.",
                    "",
                    "`s!welcome variables`",
                    "> View all available variables.",
                    "",
                    "`s!welcome help`",
                    "> Show this help menu."
                ].join("\n")
            )

            .setFooter({
                text:
                    `${client.config.botName} • Welcome System`
            })

            .setTimestamp();


    return message.reply({
        embeds: [
            embed
        ]
    });
}


// ==================================================
// TEST WELCOME
// ==================================================

async function testWelcome(
    client,
    message
) {

    const config =
        getGuildConfig(
            message.guild.id
        );


    if (!config.channelId) {

        return message.reply({
            content:
                `${client.config.emojis.error} No welcome channel has been configured.\nUse \`s!welcome channel #channel\` first.`
        });
    }


    const channel =
        message.guild.channels.cache.get(
            config.channelId
        );


    if (!channel) {

        return message.reply({
            content:
                `${client.config.emojis.error} The configured welcome channel no longer exists.`
        });
    }


    if (!config.enabled) {

        return message.reply({
            content:
                `${client.config.emojis.error} Welcome system is currently disabled.`
        });
    }


    const member =
        message.member;


    const content =
        replaceVariables(
            config.messages.message1.content,
            member,
            channel
        );


    let sent = false;


    // ==========================================
    // EMBED
    // ==========================================

    const messageConfig =
        config.messages.message1;


    if (
        messageConfig.type === "embed"
    ) {

        const e =
            messageConfig.embed;


        const embed =
            new EmbedBuilder()
                .setColor(
                    e.color ||
                    client.config.embedColor
                );


        if (e.author.name) {

            embed.setAuthor({

                name:
                    replaceVariables(
                        e.author.name,
                        member,
                        channel
                    ),

                url:
                    e.author.url || undefined,

                iconURL:
                    e.author.iconURL || undefined
            });
        }


        if (e.title) {

            embed.setTitle(
                replaceVariables(
                    e.title,
                    member,
                    channel
                )
            );
        }


        if (e.description) {

            embed.setDescription(
                replaceVariables(
                    e.description,
                    member,
                    channel
                )
            );
        }


        if (e.thumbnail) {

            embed.setThumbnail(
                replaceVariables(
                    e.thumbnail,
                    member,
                    channel
                )
            );
        }


        if (e.image) {

            embed.setImage(
                replaceVariables(
                    e.image,
                    member,
                    channel
                )
            );
        }


        if (e.footer.text) {

            embed.setFooter({

                text:
                    replaceVariables(
                        e.footer.text,
                        member,
                        channel
                    ),

                iconURL:
                    e.footer.iconURL || undefined
            });
        }


        if (e.timestamp) {
            embed.setTimestamp();
        }


        await channel.send({

            content:
                content || undefined,

            embeds: [
                embed
            ]
        });


        sent = true;
    }


    if (!sent) {

        return message.reply({
            content:
                `${client.config.emojis.error} Message 1 is not configured yet.`
        });
    }


    return message.reply({
        content:
            `${client.config.emojis.success} Test welcome message sent to ${channel}.`
    });
}


// ==================================================
// VARIABLES REPLACEMENT
// ==================================================

function replaceVariables(
    text,
    member,
    channel
) {

    if (!text) {
        return "";
    }


    const guild =
        member.guild;

    const user =
        member.user;


    const values = {

        "{user.mention}":
            `<@${user.id}>`,

        "{user.id}":
            user.id,

        "{user.name}":
            user.username,

        "{user.username}":
            user.username,

        "{user.tag}":
            user.tag,

        "{user.avatar}":
            user.displayAvatarURL({
                size: 1024
            }),

        "{user.avatar.url}":
            user.displayAvatarURL({
                size: 1024
            }),

        "{user.joinat}":
            `<t:${Math.floor(
                member.joinedTimestamp / 1000
            )}:F>`,

        "{user.createdat}":
            `<t:${Math.floor(
                user.createdTimestamp / 1000
            )}:F>`,

        "{guild.id}":
            guild.id,

        "{guild.name}":
            guild.name,

        "{guild.icon}":
            guild.iconURL({
                size: 1024
            }) || "",

        "{guild.icon.url}":
            guild.iconURL({
                size: 1024
            }) || "",

        "{guild.owner}":
            `<@${guild.ownerId}>`,

        "{guild.members}":
            guild.memberCount.toString(),

        "{guild.members.bot}":
            guild.members.cache
                .filter(
                    m => m.user.bot
                )
                .size
                .toString(),

        "{channel.id}":
            channel?.id || "",

        "{channel.name}":
            channel?.name || "",

        "{timestamp}":
            `<t:${Math.floor(
                Date.now() / 1000
            )}:F>`,

        "{date}":
            new Date()
                .toLocaleDateString(),

        "{time}":
            new Date()
                .toLocaleTimeString()
    };


    let result = text;


    for (
        const [
            variable,
            value
        ] of Object.entries(values)
    ) {

        result =
            result.split(
                variable
            ).join(
                value ?? ""
            );
    }


    return result;
}