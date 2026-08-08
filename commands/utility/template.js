const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");

module.exports = {
    name: "template",
    aliases: [],
    description: "Restore a Discord server template into this server.",

    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Restore a Discord server template into this server.")
        .addStringOption(option =>
            option
                .setName("code")
                .setDescription("Discord server template code or URL")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, message, args) {
        // --------------------------------------------------
        // GET TEMPLATE CODE
        // --------------------------------------------------

        const code = message?.options
            ? message.options.getString("code")
            : args[0];

        if (!code) {
            return message.reply({
                content:
                    `${client.config.emojis.error} Please provide a valid Discord server template code or URL.`
            });
        }

        let templateCode = code.trim();

        // Supports:
        // FKvmczH2HyUf
        // https://discord.new/FKvmczH2HyUf
        // https://discord.com/template/FKvmczH2HyUf

        const match = templateCode.match(
            /(?:discord\.new\/|discord(?:app)?\.com\/template\/)([a-zA-Z0-9-]+)/
        );

        if (match) {
            templateCode = match[1];
        }

        // --------------------------------------------------
        // PERMISSION CHECK
        // --------------------------------------------------

        if (
            !message.member ||
            !message.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} You need **Administrator** permission to use this command.`
            });
        }

        // --------------------------------------------------
        // BOT PERMISSION CHECK
        // --------------------------------------------------

        const botMember = message.guild.members.me;

        if (
            !botMember ||
            !botMember.permissions.has(PermissionFlagsBits.Administrator)
        ) {
            return message.reply({
                content:
                    `${client.config.emojis.error} I need **Administrator** permission to restore a server template.`
            });
        }

        // --------------------------------------------------
        // FETCH TEMPLATE
        // --------------------------------------------------

        let template;

        try {
            template = await client.fetchGuildTemplate(templateCode);
        } catch (error) {
            console.error("Template fetch error:", error);

            return message.reply({
                content:
                    `${client.config.emojis.error} **Template doesn't exist or cannot be accessed.**`
            });
        }

        // --------------------------------------------------
        // CONFIRMATION
        // --------------------------------------------------

        const warning = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setAuthor({
                        name: `${client.config.botName} • Template Restore`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.warning || "⚠️"} **Warning!**\n\n` +
                        `You are about to restore the template:\n\n` +
                        `> **${template.name}**\n` +
                        `> Code: \`${template.code}\`\n\n` +
                        `This may delete the current server channels and roles.\n\n` +
                        `React with ✅ within **15 seconds** to continue.`
                    )
                    .setFooter({
                        text: "This action can modify your server structure."
                    })
                    .setTimestamp()
            ]
        });

        await warning.react("✅");

        const filter = (reaction, user) =>
            reaction.emoji.name === "✅" &&
            user.id === message.author.id;

        let confirmation;

        try {
            confirmation = await warning.awaitReactions({
                filter,
                max: 1,
                time: 15000,
                errors: ["time"]
            });
        } catch {
            return warning.edit({
                content:
                    `${client.config.emojis.error} Template restore cancelled.`,
                embeds: []
            });
        }

        if (!confirmation.size) {
            return warning.edit({
                content:
                    `${client.config.emojis.error} Template restore cancelled.`,
                embeds: []
            });
        }

        // --------------------------------------------------
        // START RESTORE
        // --------------------------------------------------

        const status = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: `${client.config.botName} • Restoring Template`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(
                        `${client.config.emojis.loading || "⏳"} **Starting template restore...**`
                    )
                    .setTimestamp()
            ]
        });

        try {
            const guild = message.guild;

            // --------------------------------------------------
            // GET SERIALIZED GUILD
            // --------------------------------------------------

            const serialized = template.serializedGuild;

            if (!serialized) {
                throw new Error(
                    "This Discord template does not contain serialized guild data."
                );
            }

            // --------------------------------------------------
            // DELETE EXISTING CHANNELS
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Removing existing channels...**`
                        )
                ]
            });

            const existingChannels = [...guild.channels.cache.values()];

            for (const channel of existingChannels) {
                try {
                    await channel.delete("Discord template restore");
                } catch (error) {
                    console.log(
                        `Could not delete channel ${channel.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // DELETE EXISTING CUSTOM ROLES
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Removing existing roles...**`
                        )
                ]
            });

            const existingRoles = [...guild.roles.cache.values()]
                .filter(role => role.id !== guild.id)
                .filter(role => !role.managed)
                .sort((a, b) => b.position - a.position);

            for (const role of existingRoles) {
                try {
                    await role.delete("Discord template restore");
                } catch (error) {
                    console.log(
                        `Could not delete role ${role.name}:`,
                        error.message
                    );
                }
            }

            // --------------------------------------------------
            // ROLE MAP
            // --------------------------------------------------

            const roleMap = new Map();

            // @everyone role
            if (serialized.roles?.length) {
                const everyoneTemplateRole = serialized.roles.find(
                    role => role.id === serialized.id
                );

                if (everyoneTemplateRole) {
                    roleMap.set(
                        everyoneTemplateRole.id,
                        guild.roles.everyone.id
                    );
                }
            }

            // --------------------------------------------------
            // CREATE ROLES
            // --------------------------------------------------

            await status.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `${client.config.emojis.loading || "⏳"} **Creating roles...**`
                        )
                ]
            });

            const templateRoles = (serialized.roles || [])
                .filter(role => role.id !== serialized.id)
                .filter(role => !role.managed)
                .sort((a, b) => a