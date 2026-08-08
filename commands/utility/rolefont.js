const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "rolefont",
    aliases: ["role-font"],
    description: "Convert all server role names to normal font.",

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

        // ==================================================
        // ARGUMENT CHECK
        // ==================================================

        const mode = args[0]?.toLowerCase();

        if (mode !== "normal") {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please use:\n` +
                    `\`s!rolefont normal\``
            });
        }

        const guild = message.guild;
        const member = message.member;
        const botMember = guild.members.me;

        // ==================================================
        // USER PERMISSION
        // ==================================================

        if (
            !member.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Manage Roles** permission to use this command.`
            });
        }

        // ==================================================
        // BOT PERMISSION
        // ==================================================

        if (
            !botMember ||
            !botMember.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Manage Roles** permission to edit roles.`
            });
        }

        // ==================================================
        // START MESSAGE
        // ==================================================

        const status = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Role Font`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Converting role names to normal font...**`
                    )
                    .setTimestamp()
            ]
        });

        // ==================================================
        // GET ROLES
        // ==================================================

        const roles = [...guild.roles.cache.values()]
            .filter(role => role.id !== guild.id)
            .filter(role => !role.managed)
            .sort((a, b) => b.position - a.position);

        let changed = 0;
        let skipped = 0;

        // ==================================================
        // PROCESS ROLES
        // ==================================================

        for (const role of roles) {

            // Bot cannot edit roles above/equal to its highest role
            if (
                role.position >= botMember.roles.highest.position
            ) {
                skipped++;
                continue;
            }

            let newName = role.name;

            // --------------------------------------------------
            // REMOVE EVERYTHING AFTER ┃
            // Example:
            // Staff ┃ Chat
            // Staff
            // --------------------------------------------------

            if (newName.includes("┃")) {
                newName = newName
                    .split("┃")[0]
                    .trim();
            }

            // --------------------------------------------------
            // CONVERT FANCY UNICODE FONT TO NORMAL FONT
            // --------------------------------------------------

            newName = toNormalFont(newName);

            // Remove extra spaces
            newName = newName
                .replace(/\s+/g, " ")
                .trim();

            // Discord role name cannot be empty
            if (!newName) {
                newName = "Role";
            }

            // --------------------------------------------------
            // SAME NAME = SKIP
            // --------------------------------------------------

            if (newName === role.name) {
                skipped++;
                continue;
            }

            // --------------------------------------------------
            // EDIT ROLE
            // --------------------------------------------------

            try {

                await role.setName(
                    newName,
                    "Role font normalization"
                );

                changed++;

            } catch (error) {

                skipped++;

                console.log(
                    `Role edit failed: ${role.name}`,
                    error.message
                );
            }
        }

        // ==================================================
        // FINISH
        // ==================================================

        return status.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name:
                            `${client.config.botName} • Role Font`,
                        iconURL:
                            client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.success} **Role fonts converted successfully!**\n\n` +

                        `${client.config.emojis.role || "🎭"} **Roles Updated**\n` +
                        `> ${changed}\n\n` +

                        `${client.config.emojis.info || "ℹ️"} **Skipped**\n` +
                        `> ${skipped}\n\n` +

                        `All editable roles were converted to **normal font** and text after \`┃\` was removed.`
                    )
                    .setFooter({
                        text:
                            `${client.config.botName} • Role Font`
                    })
                    .setTimestamp()
            ]
        });
    }
};


// ==========================================================
// FANCY UNICODE → NORMAL FONT
// ==========================================================

function toNormalFont(text) {

    const normal = {
        // Bold
        "𝐀": "A", "𝐁": "B", "𝐂": "C", "𝐃": "D",
        "𝐄": "E", "𝐅": "F", "𝐆": "G", "𝐇": "H",
        "𝐈": "I", "𝐉": "J", "𝐊": "K", "𝐋": "L",
        "𝐌": "M", "𝐍": "N", "𝐎": "O", "𝐏": "P",
        "𝐐": "Q", "𝐑": "R", "𝐒": "S", "𝐓": "T",
        "𝐔": "U", "𝐕": "V", "𝐖": "W", "𝐗": "X",
        "𝐘": "Y", "𝐙": "Z",

        "𝐚": "a", "𝐛": "b", "𝐜": "c", "𝐝": "d",
        "𝐞": "e", "𝐟": "f", "𝐠": "g", "𝐡": "h",
        "𝐢": "i", "𝐣": "j", "𝐤": "k", "𝐥": "l",
        "𝐦": "m", "𝐧": "n", "𝐨": "o", "𝐩": "p",
        "𝐪": "q", "𝐫": "r", "𝐬": "s", "𝐭": "t",
        "𝐮": "u", "𝐯": "v", "𝐰": "w", "𝐱": "x",
        "𝐲": "y", "𝐳": "z",

        // Mathematical Sans
        "𝖠": "A", "𝖡": "B", "𝖢": "C", "𝖣": "D",
        "𝖤": "E", "𝖥": "F", "𝖦": "G", "𝖧": "H",
        "𝖨": "I", "𝖩": "J", "𝖪": "K", "𝖫": "L",
        "𝖬": "M", "𝖭": "N", "𝖮": "O", "𝖯": "P",
        "𝖰": "Q", "𝖱": "R", "𝖲": "S", "𝖳": "T",
        "𝖴": "U", "𝖵": "V", "𝖶": "W", "𝖷": "X",
        "𝖸": "Y", "𝖹": "Z",

        "𝖺": "a", "𝖻": "b", "𝖼": "c", "𝖽": "d",
        "𝖾": "e", "𝖿": "f", "𝗀": "g", "𝗁": "h",
        "𝗂": "i", "𝗃": "j", "𝗄": "k", "𝗅": "l",
        "𝗆": "m", "𝗇": "n", "𝗈": "o", "𝗉": "p",
        "𝗊": "q", "𝗋": "r", "𝗌": "s", "𝗍": "t",
        "𝗎": "u", "𝗏": "v", "𝗐": "w", "𝗑": "x",
        "𝗒": "y", "𝗓": "z",

        // Small caps commonly used in Discord names
        "ᴀ": "A",
        "ʙ": "B",
        "ᴄ": "C",
        "ᴅ": "D",
        "ᴇ": "E",
        "ꜰ": "F",
        "ɢ": "G",
        "ʜ": "H",
        "ɪ": "I",
        "ᴊ": "J",
        "ᴋ": "K",
        "ʟ": "L",
        "ᴍ": "M",
        "ɴ": "N",
        "ᴏ": "O",
        "ᴘ": "P",
        "ǫ": "Q",
        "ʀ": "R",
        "s": "S",
        "ᴛ": "T",
        "ᴜ": "U",
        "ᴠ": "V",
        "ᴡ": "W",
        "x": "X",
        "ʏ": "Y",
        "ᴢ": "Z"
    };

    return [...text]
        .map(char => normal[char] || char)
        .join("");
}