const fs = require("fs");
const path = require("path");

const {
    EmbedBuilder
} = require("discord.js");

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
// READ WELCOME DATA
// ==========================================

function getWelcomeData() {

    try {

        if (!fs.existsSync(configFile)) {
            return {};
        }

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
            "[Welcome] Failed to read welcome.json:",
            error
        );

        return {};

    }

}


// ==========================================
// REPLACE VARIABLES
// ==========================================

function replaceVariables(
    text,
    member
) {

    if (!text) {
        return "";
    }

    const guild =
        member.guild;

    const user =
        member.user;

    const now =
        Math.floor(
            Date.now() / 1000
        );


    const values = {

        // ======================================
        // USER
        // ======================================

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
                size: 1024,
                extension: "png"
            }),

        "{user.avatar.url}":
            user.displayAvatarURL({
                size: 1024,
                extension: "png"
            }),

        "{user.joinat}":
            `<t:${Math.floor(
                member.joinedTimestamp / 1000
            )}:F>`,

        "{user.createdat}":
            `<t:${Math.floor(
                user.createdTimestamp / 1000
            )}:F>`,

        // ======================================
        // GUILD
        // ======================================

        "{guild.id}":
            guild.id,

        "{guild.name}":
            guild.name,

        "{guild.icon}":
            guild.iconURL() || "",

        "{guild.icon.url}":
            guild.iconURL() || "",

        "{guild.owner}":
            `<@${guild.ownerId}>`,

        "{guild.members}":
            guild.memberCount.toString(),

        "{guild.members.bot}":
            guild.members.cache
                .filter(member => member.user.bot)
                .size
                .toString(),

        // ======================================
        // CHANNEL
        // ======================================

        "{channel.id}":
            "",

        "{channel.name}":
            "",

        // ======================================
        // TIME
        // ======================================

        "{timestamp}":
            `<t:${now}:F>`,

        "{date}":
            new Date().toLocaleDateString(),

        "{time}":
            new Date().toLocaleTimeString()

    };


    let result = text;


    for (
        const [variable, value]
        of Object.entries(values)
    ) {

        result =
            result.replaceAll(
                variable,
                value
            );

    }


    return result;

}


// ==========================================
// CREATE WELCOME EMBED
// ==========================================

function createWelcomeEmbed(
    client,
    member,
    config
) {

    const embedConfig =
        config.embed || {};


    const embed =
        new EmbedBuilder()
            .setColor(
                embedConfig.color ||
                client.config.embedColor
            );


    // ======================================
    // AUTHOR
    // ======================================

    if (
        embedConfig.author &&
        embedConfig.author.name
    ) {

        const author = {

            name:
                replaceVariables(
                    embedConfig.author.name,
                    member
                )

        };


        if (
            embedConfig.author.url
        ) {

            author.url =
                replaceVariables(
                    embedConfig.author.url,
                    member
                );

        }


        if (
            embedConfig.author.iconURL
        ) {

            author.iconURL =
                replaceVariables(
                    embedConfig.author.iconURL,
                    member
                );

        }


        embed.setAuthor(author);

    }


    // ======================================
    // TITLE
    // ======================================

    if (
        embedConfig.title
    ) {

        embed.setTitle(
            replaceVariables(
                embedConfig.title,
                member
            )
        );

    }


    // ======================================
    // DESCRIPTION
    // ======================================

    if (
        embedConfig.description
    ) {

        embed.setDescription(
            replaceVariables(
                embedConfig.description,
                member
            )
        );

    }


    // ======================================
    // THUMBNAIL
    // ======================================

    if (
        embedConfig.thumbnail
    ) {

        const thumbnail =
            replaceVariables(
                embedConfig.thumbnail,
                member
            );


        if (
            /^https?:\/\//i.test(
                thumbnail
            )
        ) {

            embed.setThumbnail(
                thumbnail
            );

        }

    }


    // ======================================
    // IMAGE
    // ======================================

    if (
        embedConfig.image
    ) {

        const image =
            replaceVariables(
                embedConfig.image,
                member
            );


        if (
            /^https?:\/\//i.test(
                image
            )
        ) {

            embed.setImage(
                image
            );

        }

    }


    // ======================================
    // FOOTER
    // ======================================

    if (
        embedConfig.footer &&
        embedConfig.footer.text
    ) {

        const footer = {

            text:
                replaceVariables(
                    embedConfig.footer.text,
                    member
                )

        };


        if (
            embedConfig.footer.iconURL
        ) {

            footer.iconURL =
                replaceVariables(
                    embedConfig.footer.iconURL,
                    member
                );

        }


        embed.setFooter(footer);

    }


    // ======================================
    // TIMESTAMP
    // ======================================

    if (
        embedConfig.timestamp
    ) {

        embed.setTimestamp();

    }


    return embed;

}


// ==========================================
// SEND DM
// ==========================================

async function sendWelcomeDM(
    member,
    config
) {

    if (
        !config.dmEnabled ||
        !config.dmMessage
    ) {
        return;
    }


    const message =
        replaceVariables(
            config.dmMessage,
            member
        );


    if (!message) {
        return;
    }


    try {

        await member.send({
            content: message
        });

    } catch (error) {

        // User may have DMs disabled.
        console.log(
            `[Welcome] Could not DM ${member.user.tag}.`
        );

    }

}


// ==========================================
// EVENT
// ==========================================

module.exports = {

    name: "guildMemberAdd",

    async execute(
        client,
        member
    ) {

        try {

            // ======================================
            // GET DATA
            // ======================================

            const data =
                getWelcomeData();


            const config =
                data[member.guild.id];


            // ======================================
            // NO CONFIG
            // ======================================

            if (!config) {
                return;
            }


            // ======================================
            // DISABLED
            // ======================================

            if (!config.enabled) {
                return;
            }


            // ======================================
            // CHANNEL
            // ======================================

            if (
                !config.channelId
            ) {

                console.log(
                    `[Welcome] No welcome channel configured for ${member.guild.name}.`
                );

                return;
            }


            const channel =
                await member.guild.channels
                    .fetch(
                        config.channelId
                    )
                    .catch(
                        () => null
                    );


            // ======================================
            // INVALID CHANNEL
            // ======================================

            if (
                !channel ||
                !channel.isTextBased()
            ) {

                console.log(
                    `[Welcome] Welcome channel is invalid in ${member.guild.name}.`
                );

                return;
            }


            // ======================================
            // PERMISSION
            // ======================================

            const permissions =
                channel.permissionsFor(
                    member.guild.members.me
                );


            if (
                !permissions ||
                !permissions.has("SendMessages")
            ) {

                console.log(
                    `[Welcome] I cannot send messages in #${channel.name}.`
                );

                return;
            }


            // ======================================
            // MESSAGE
            // ======================================

            const content =
                replaceVariables(
                    config.message,
                    member
                );


            // ======================================
            // EMBED
            // ======================================

            const embed =
                createWelcomeEmbed(
                    client,
                    member,
                    config
                );


            // ======================================
            // CHECK WHETHER EMBED HAS CONTENT
            // ======================================

            const hasEmbedContent =
                config.embed &&
                (
                    config.embed.title ||
                    config.embed.description ||
                    config.embed.thumbnail ||
                    config.embed.image ||
                    (
                        config.embed.author &&
                        config.embed.author.name
                    ) ||
                    (
                        config.embed.footer &&
                        config.embed.footer.text
                    )
                );


            // ======================================
            // SEND
            // ======================================

            const payload = {};


            if (content) {

                payload.content =
                    content;

            }


            if (hasEmbedContent) {

                payload.embeds = [
                    embed
                ];

            }


            // Don't send empty message
            if (
                !payload.content &&
                !payload.embeds
            ) {

                console.log(
                    `[Welcome] No welcome message/embed configured for ${member.guild.name}.`
                );

            } else {

                await channel.send(
                    payload
                );

            }


            // ======================================
            // DM
            // ======================================

            await sendWelcomeDM(
                member,
                config
            );


            console.log(
                `[Welcome] Sent welcome message for ${member.user.tag} in ${member.guild.name}.`
            );


        } catch (error) {

            console.error(
                "[Welcome] guildMemberAdd error:",
                error
            );

        }

    }

};