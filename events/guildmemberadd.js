const {
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(client, member) {

        // ==================================================
        // BASIC CHECK
        // ==================================================

        if (!member || !member.guild) return;

        const guild = member.guild;

        // ==================================================
        // WELCOME CONFIG
        // ==================================================

        if (!client.welcomeConfigs) {
            return;
        }

        const config =
            client.welcomeConfigs.get(
                guild.id
            );

        if (!config) return;

        // Welcome system disabled
        if (!config.enabled) return;

        // ==================================================
        // GET CHANNEL
        // ==================================================

        if (!config.channelId) return;

        const channel =
            guild.channels.cache.get(
                config.channelId
            );

        if (!channel) return;

        // ==================================================
        // VARIABLE REPLACER
        // ==================================================

        const replaceVariables = text => {

            if (!text) return "";

            return text
                .replace(
                    /\{user\.mention\}/gi,
                    `<@${member.id}>`
                )
                .replace(
                    /\{user\.id\}/gi,
                    member.id
                )
                .replace(
                    /\{user\.name\}/gi,
                    member.user.displayName ||
                    member.user.username
                )
                .replace(
                    /\{user\.username\}/gi,
                    member.user.username
                )
                .replace(
                    /\{user\.avatar\}/gi,
                    member.user.displayAvatarURL({
                        extension: "png",
                        size: 1024
                    })
                )
                .replace(
                    /\{user\.joinat\}/gi,
                    `<t:${Math.floor(
                        member.joinedTimestamp / 1000
                    )}:F>`
                )
                .replace(
                    /\{timestamp\}/gi,
                    `<t:${Math.floor(
                        Date.now() / 1000
                    )}:F>`
                )
                .replace(
                    /\{guild\.name\}/gi,
                    guild.name
                )
                .replace(
                    /\{guild\.id\}/gi,
                    guild.id
                )
                .replace(
                    /\{guild\.members\}/gi,
                    guild.memberCount.toString()
                )
                .replace(
                    /\{guild\.owner\}/gi,
                    `<@${guild.ownerId}>`
                )
                .replace(
                    /\{guild\.icon\}/gi,
                    guild.iconURL({
                        extension: "png",
                        size: 1024
                    }) || ""
                );
        };

        // ==================================================
        // EMBED
        // ==================================================

        let embed;

        if (config.embed) {

            const embedData =
                config.embed;

            embed =
                new EmbedBuilder();

            // Colour

            if (embedData.color) {

                embed.setColor(
                    embedData.color
                );
            }

            // Title

            if (embedData.title) {

                embed.setTitle(
                    replaceVariables(
                        embedData.title
                    )
                );
            }

            // Description

            if (embedData.description) {

                embed.setDescription(
                    replaceVariables(
                        embedData.description
                    )
                );
            }

            // URL

            if (embedData.url) {

                embed.setURL(
                    replaceVariables(
                        embedData.url
                    )
                );
            }

            // Author

            if (embedData.author) {

                const author =
                    embedData.author;

                if (
                    author.name
                ) {

                    embed.setAuthor({
                        name:
                            replaceVariables(
                                author.name
                            ),

                        url:
                            author.url
                                ? replaceVariables(
                                    author.url
                                )
                                : undefined,

                        iconURL:
                            author.iconURL
                                ? replaceVariables(
                                    author.iconURL
                                )
                                : undefined
                    });
                }
            }

            // Thumbnail

            if (embedData.thumbnail) {

                embed.setThumbnail(
                    replaceVariables(
                        embedData.thumbnail
                    )
                );
            }

            // Image

            if (embedData.image) {

                embed.setImage(
                    replaceVariables(
                        embedData.image
                    )
                );
            }

            // Footer

            if (embedData.footer) {

                embed.setFooter({
                    text:
                        replaceVariables(
                            embedData.footer.text ||
                            ""
                        ),

                    iconURL:
                        embedData.footer.iconURL
                            ? replaceVariables(
                                embedData.footer.iconURL
                            )
                            : undefined
                });
            }

            // Timestamp

            if (embedData.timestamp) {

                embed.setTimestamp();
            }
        }

        // ==================================================
        // NORMAL TEXT
        // ==================================================

        let content = "";

        if (config.message) {

            content =
                replaceVariables(
                    config.message
                );
        }

        // ==================================================
        // BUTTONS
        // ==================================================

        const components = [];

        if (
            Array.isArray(
                config.buttons
            ) &&
            config.buttons.length
        ) {

            const row =
                new ActionRowBuilder();

            for (
                const buttonData
                of config.buttons
            ) {

                if (
                    row.components.length >= 5
                ) {
                    break;
                }

                const button =
                    new ButtonBuilder()
                        .setLabel(
                            replaceVariables(
                                buttonData.label ||
                                "Button"
                            )
                        );

                // ------------------------------------------
                // LINK BUTTON
                // ------------------------------------------

                if (
                    buttonData.url
                ) {

                    button
                        .setStyle(
                            ButtonStyle.Link
                        )
                        .setURL(
                            replaceVariables(
                                buttonData.url
                            )
                        );

                }

                // ------------------------------------------
                // NORMAL BUTTON
                // ------------------------------------------

                else {

                    button
                        .setStyle(
                            getButtonStyle(
                                buttonData.style
                            )
                        )
                        .setCustomId(
                            buttonData.customId ||
                            `welcome_button_${Date.now()}`
                        );
                }

                // ------------------------------------------
                // EMOJI
                // ------------------------------------------

                if (
                    buttonData.emoji
                ) {

                    try {

                        button.setEmoji(
                            buttonData.emoji
                        );

                    } catch {}
                }

                row.addComponents(
                    button
                );
            }

            if (
                row.components.length
            ) {

                components.push(row);
            }
        }

        // ==================================================
        // SEND WELCOME
        // ==================================================

        try {

            await channel.send({

                content:
                    content || undefined,

                embeds:
                    embed
                        ? [embed]
                        : [],

                components
            });

        } catch (error) {

            console.error(
                `Welcome message failed in ${guild.name}:`,
                error
            );
        }

        // ==================================================
        // DM MESSAGE
        // ==================================================

        if (config.dmEnabled && config.dmMessage) {

            try {

                await member.send(
                    replaceVariables(
                        config.dmMessage
                    )
                );

            } catch (error) {

                console.log(
                    `Could not DM ${member.user.tag}:`,
                    error.message
                );
            }
        }
    }
};


// ==========================================================
// BUTTON STYLE
// ==========================================================

function getButtonStyle(style) {

    switch (
        String(style || "")
            .toLowerCase()
    ) {

        case "primary":
        case "blue":
            return ButtonStyle.Primary;

        case "success":
        case "green":
            return ButtonStyle.Success;

        case "danger":
        case "red":
            return ButtonStyle.Danger;

        case "secondary":
        case "grey":
        case "gray":
        default:
            return ButtonStyle.Secondary;
    }
}