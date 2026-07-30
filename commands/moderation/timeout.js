const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "timeout",
    aliases: ["to", "mute"],
    description: "Timeout a member.",

    async execute(client, message, args) {

        if (
            !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
        ) {
            return message.reply({
                content: `${client.config.emojis.error} You don't have permission to use this command.`
            });
        }

        if (
            !message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)
        ) {
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

        if (
            member.roles.highest.position >=
            message.member.roles.highest.position
        ) {

            const immune = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Action Denied`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.error} __**Immune Staff**__

${client.config.emojis.user} **Target**
> ${member.user.tag}

${client.config.emojis.message} **Reason**
> This member has an equal or higher role than you.
`)
                .setFooter({
                    text: client.config.botName
                })
                .setTimestamp();

            return message.reply({
                embeds: [immune]
            });

        }

        if (
            member.roles.highest.position >=
            message.guild.members.me.roles.highest.position
        ) {

            return message.reply({
                content: `${client.config.emojis.error} My role is lower than this member's role.`
            });

        }

        const durationInput = args[1];

        if (!durationInput) {
            return message.reply({
                content:
`${client.config.emojis.error} Please provide a duration.\nExample: \`s!timeout @user 30m ?r Spamming\``
            });
        }

        function parseDuration(input) {

            const match = input
                .toLowerCase()
                .match(/^(\d+)(s|m|h|d|w|mo|y)$/);

            if (!match) return null;

            const value = Number(match[1]);
            const unit = match[2];

            const table = {
                s: 1000,
                m: 60000,
                h: 3600000,
                d: 86400000,
                w: 604800000,
                mo: 2592000000,
                y: 31536000000
            };

            return value * table[unit];

        }

        const duration = parseDuration(durationInput);

        if (!duration) {
            return message.reply({
                content:
`${client.config.emojis.error} Invalid duration.\nSupported: \`30s\` \`5m\` \`2h\` \`1d\` \`1w\` \`1mo\` \`1y\``
            });
        }

        const maxDuration =
            28 * 24 * 60 * 60 * 1000;

        if (duration > maxDuration) {

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Invalid Duration`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`
${client.config.emojis.error} **Discord only allows timeouts up to 28 days.**

Please choose a shorter duration.
`)
                .setFooter({
                    text: client.config.botName
                })
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        const reasonIndex =
            args.findIndex(x => x.toLowerCase() === "?r");

        const reason =
            reasonIndex === -1
                ? "No reason provided."
                : args.slice(reasonIndex + 1).join(" ") ||
                  "No reason provided.";

        // ===== PART 2 STARTS HERE =====
        const dmDuration = durationInput;

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
${client.config.emojis.time} **Duration:** ${dmDuration}
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

            return message.reply({
                flags: 1 << 15,
                components: [
                    {
                        type: 17,
                        accent_color: 0xE53935,
                        components: [
                            {
                                type: 10,
                                content: `${client.config.emojis.timeout} **Member Timed Out**`
                            },
                            {
                                type: 14
                            },
                            {
                                type: 10,
                                content:
`${client.config.emojis.user} **User:** ${member.user.tag}
${client.config.emojis.moderator} **Moderator:** ${message.author.tag}
${client.config.emojis.time} **Duration:** ${dmDuration}
${client.config.emojis.message} **Reason:** ${reason}`
                            },
                            {
                                type: 14
                            },
                            {
                                type: 10,
                                content: `${client.config.emojis.success} Timeout executed successfully.`
                            }
                        ]
                    }
                ]
            });

        } catch (err) {

            console.error(err);

            return message.reply({
                content: `${client.config.emojis.error} Failed to timeout this member.`
            });

        }

    }

};