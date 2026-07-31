const {
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "timeout",
    aliases: ["to", "mute"],
    description: "Timeout a member.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} You don't have permission to use this command.`
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have the **Moderate Members** permission.`
            });
        }

        const member =
            message.mentions.members.first() ||
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!member) {
            return message.reply({
                content: `${client.config.emojis.error} Please mention a valid member.`
            });
        }

        if (member.id === message.author.id) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot timeout yourself.`
            });
        }

        if (member.id === client.user.id) {
            return message.reply({
                content: `${client.config.emojis.error} I cannot timeout myself.`
            });
        }

        if (member.id === message.guild.ownerId) {
            return message.reply({
                content: `${client.config.emojis.error} You cannot timeout the server owner.`
            });
        }

        if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {

            const immuneEmbed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Immune Staff`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.error} **Action Denied**
${client.config.emojis.user} **Target**
 ${member.user.tag}
${client.config.emojis.message} **Reason**
 This member has the **Moderate Members** permission.
`)
                .setFooter({
                    text: client.config.botName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return message.reply({
                embeds: [immuneEmbed]
            });

        }

        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} This member has an equal or higher role than you.`
            });
        }

        if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                content: `${client.config.emojis.error} My role is lower than this member's role.`
            });
        }

        const durationInput = args[1];

        if (!durationInput) {
            return message.reply({
                content: `${client.config.emojis.error} Please provide a duration.\nExample: \`s!timeout @user 30m ?r Spamming\``
            });
        }

        function parseDuration(input) {

            const match = input
                .toLowerCase()
                .match(/^(\d+)(s|m|h|d|w|mo)$/);

            if (!match) return null;

            const value = Number(match[1]);
            const unit = match[2];

            const units = {
                s: 1000,
                m: 60000,
                h: 3600000,
                d: 86400000,
                w: 604800000,
                mo: 2592000000
            };

            return value * units[unit];

        }

        const duration = parseDuration(durationInput);

        if (!duration) {
            return message.reply({
                content: `${client.config.emojis.error} Invalid duration.\nSupported: \`30s\`, \`5m\`, \`2h\`, \`7d\`, \`1w\`, \`1mo\`.`
            });
        }

        if (duration > 2419200000) {
            return message.reply({
                content: `${client.config.emojis.error} Discord only allows timeouts up to **28 days**.`
            });
        }

        const reasonIndex = args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";

        // ===== Part 1B Starts Here =====
        const confirmEmbed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
                name: `${client.config.botName} • Confirm Timeout`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`
${client.config.emojis.user} **Target**
${member.user.tag} (\`${member.id}\`)
${client.config.emojis.time} **Duration**
${durationInput}
${client.config.emojis.message} **Reason**
${reason}
`)
            .setFooter({
                text: "Press Confirm to timeout this member.",
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("timeout_confirm")
                    .setLabel("Confirm")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("timeout_cancel")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Secondary)
            );

        const confirmMessage = await message.reply({
            embeds: [confirmEmbed],
            components: [row]
        });

        const filter = i =>
            i.user.id === message.author.id &&
            i.message.id === confirmMessage.id;

        const collector =
            confirmMessage.createMessageComponentCollector({
                filter,
                time: 30000,
                max: 1
            });

        collector.on("collect", async interaction => {

            if (interaction.customId === "timeout_cancel") {

                const cancelled = new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Timeout Cancelled`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`
${client.config.emojis.error} **The timeout action has been cancelled.**
`)
                    .setTimestamp();

                return interaction.update({
                    embeds: [cancelled],
                    components: []
                });

            }

            // ===== Part 2 Starts Here =====
            try {

                await member.send({
                    flags: 1 << 15,
                    components: [
                        {
                            type: 17,
                            accent_color: 0xE53935,
                            components: [
                                {
                                    type: 10,
                                    content: `${client.config.emojis.timeout} **You have been timed out.**`
                                },
                                {
                                    type: 14
                                },
                                {
                                    type: 10,
                                    content:
`${client.config.emojis.member} **Server:** ${message.guild.name}
${client.config.emojis.time} **Duration:** ${durationInput}
${client.config.emojis.moderator} **Moderator:** ${message.author.tag}
${client.config.emojis.message} **Reason:** ${reason}`
                                },
                                {
                                    type: 14
                                },
                                {
                                    type: 10,
                                    content: `-# ${client.config.botName} • Timeout Notice`
                                }
                            ]
                        }
                    ]
                }).catch(() => {});

                await member.timeout(
                    duration,
                    `${reason} | By ${message.author.tag}`
                );

                const success = new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Member Timed Out`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`
${client.config.emojis.success} **Action Executed Successfully**

${client.config.emojis.user} **User**
> ${member.user.tag} (\`${member.id}\`)

${client.config.emojis.moderator} **Moderator**
 ${message.author.tag}
${client.config.emojis.time} **Duration**
 ${durationInput}
${client.config.emojis.message} **Reason**
 ${reason}
`)
                    .setFooter({
                        text: client.config.botName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await interaction.update({
                    embeds: [success],
                    components: []
                });

            } catch (err) {

                console.error(err);

                await interaction.update({
                    content: `${client.config.emojis.error} Failed to timeout this member.`,
                    embeds: [],
                    components: []
                });

            }

        });

        collector.on("end", async (_, reason) => {

            if (reason !== "time") return;

            try {

                await confirmMessage.edit({
                    components: []
                });

            } catch {}

        });

    }

};