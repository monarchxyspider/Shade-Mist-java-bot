const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

// ==========================================================
// FANCY UNICODE → NORMAL TEXT
// ==========================================================

const fancyMap = new Map();

// ----------------------------------------------------------
// Mathematical Unicode alphabets
// ----------------------------------------------------------

const normalSets = [
    // Bold
    ["𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳",
     "abcdefghijklmnopqrstuvwxyz"],

    // Italic
    ["𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧",
     "abcdefghijklmnopqrstuvwxyz"],

    // Bold Italic
    ["𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛",
     "abcdefghijklmnopqrstuvwxyz"],

    // Script
    ["𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏",
     "abcdefghijklmnopqrstuvwxyz"],

    // Bold Script
    ["𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
     "abcdefghijklmnopqrstuvwxyz"],

    // Fraktur
    ["𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
     "abcdefghijklmnopqrstuvwxyz"],

    // Double-struck
    ["𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
     "abcdefghijklmnopqrstuvwxyz"],

    // Sans
    ["𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓",
     "abcdefghijklmnopqrstuvwxyz"],

    // Sans Bold
    ["𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
     "abcdefghijklmnopqrstuvwxyz"],

    // Sans Italic
    ["𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻",
     "abcdefghijklmnopqrstuvwxyz"],

    // Sans Bold Italic
    ["𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯",
     "abcdefghijklmnopqrstuvwxyz"],

    // Monospace
    ["𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉",
     "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],

    ["𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣",
     "abcdefghijklmnopqrstuvwxyz"]
];

// Build map
for (const [fancy, normal] of normalSets) {
    const fancyChars = [...fancy];
    const normalChars = [...normal];

    for (let i = 0; i < fancyChars.length; i++) {
        fancyMap.set(
            fancyChars[i],
            normalChars[i]
        );
    }
}

// ----------------------------------------------------------
// Small Caps / Phonetic Unicode
// ----------------------------------------------------------

const smallCaps = {
    "ᴀ": "a",
    "ʙ": "b",
    "ᴄ": "c",
    "ᴅ": "d",
    "ᴇ": "e",
    "ꜰ": "f",
    "ɢ": "g",
    "ʜ": "h",
    "ɪ": "i",
    "ᴊ": "j",
    "ᴋ": "k",
    "ʟ": "l",
    "ᴍ": "m",
    "ɴ": "n",
    "ᴏ": "o",
    "ᴘ": "p",
    "ǫ": "q",
    "ʀ": "r",
    "s": "s",
    "ᴛ": "t",
    "ᴜ": "u",
    "ᴠ": "v",
    "ᴡ": "w",
    "x": "x",
    "ʏ": "y",
    "ᴢ": "z",

    "ⱽ": "v",
    "ᴮ": "b",
    "ᴰ": "d",
    "ᴳ": "g",
    "ᴴ": "h",
    "ᴶ": "j",
    "ᴷ": "k",
    "ᴸ": "l",
    "ᴹ": "m",
    "ᴺ": "n",
    "ᴾ": "p",
    "ᴿ": "r",
    "ᵀ": "t",
    "ᵁ": "u",
    "ᵂ": "w"
};

for (const [fancy, normal] of Object.entries(smallCaps)) {
    fancyMap.set(fancy, normal);
}

// ==========================================================
// CONVERTER
// ==========================================================

function convertToNormal(text) {

    let result = "";

    for (const char of text) {

        if (fancyMap.has(char)) {
            result += fancyMap.get(char);
        } else {
            result += char;
        }
    }

    // Also handle normal Unicode compatibility characters
    return result.normalize("NFKC");
}


// ==========================================================
// COMMAND
// ==========================================================

module.exports = {
    name: "channelfont",
    aliases: [
        "channel-font",
        "cf"
    ],

    description:
        "Convert all channel names to normal font.",

    async execute(client, message, args) {

        // ==================================================
        // SERVER CHECK
        // ==================================================

        if (!message.guild) {

            return message.reply({
                content:
                    `${client.config.emojis.error} This command can only be used inside a server.`
            });
        }

        const guild = message.guild;

        // ==================================================
        // ARGUMENT CHECK
        // ==================================================

        const style =
            args[0]?.toLowerCase();

        if (style !== "normal") {

            return message.reply({
                content:
                    `${client.config.emojis.error} Please use:\n` +
                    `\`s!channelfont normal\``
            });
        }

        // ==================================================
        // USER PERMISSION
        // ==================================================

        if (
            !message.member.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {

            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Channels** permission to rename channels.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        const botMember =
            guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.ManageChannels
            )
        ) {

            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Manage Channels** permission to rename channels.`
            });
        }

        // ==================================================
        // START
        // ==================================================

        const status =
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            client.config.embedColor
                        )
                        .setAuthor({
                            name:
                                `${client.config.botName} • Channel Font`,
                            iconURL:
                                client.user.displayAvatarURL()
                        })
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Converting channel names...**`
                        )
                        .setTimestamp()
                ]
            });

        // ==================================================
        // PROCESS CHANNELS
        // ==================================================

        let changed = 0;
        let unchanged = 0;
        let failed = 0;

        const channels =
            [...guild.channels.cache.values()];

        for (const channel of channels) {

            try {

                // Bot cannot manage this channel
                if (!channel.manageable) {

                    failed++;
                    continue;
                }

                const oldName =
                    channel.name;

                const newName =
                    convertToNormal(oldName);

                // Nothing changed
                if (
                    oldName === newName
                ) {

                    unchanged++;
                    continue;
                }

                await channel.setName(
                    newName,
                    "Convert channel name to normal font"
                );

                changed++;

            } catch (error) {

                failed++;

                console.log(
                    `Channel font error [${channel.name}]:`,
                    error.message
                );
            }
        }

        // ==================================================
        // RESULT
        // ==================================================

        return status.edit({

            embeds: [

                new EmbedBuilder()
                    .setColor(
                        client.config.embedColor
                    )

                    .setAuthor({
                        name:
                            `${client.config.botName} • Channel Font`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })

                    .setDescription(

                        `${client.config.emojis.success} **Channel Fonts Converted**\n\n` +

                        `${client.config.emojis.channel || "📁"} **Changed**\n` +
                        `> ${changed}\n\n` +

                        `${client.config.emojis.info} **Already Normal**\n` +
                        `> ${unchanged}\n\n` +

                        `${client.config.emojis.error} **Failed / Not Manageable**\n` +
                        `> ${failed}\n\n` +

                        `${client.config.emojis.success} Fancy Unicode letters were converted to normal letters while emojis and symbols were preserved.`
                    )

                    .setFooter({
                        text:
                            `${client.config.botName} • Channel Font`
                    })

                    .setTimestamp()
            ]
        });
    }
};