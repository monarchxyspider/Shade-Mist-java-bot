const {
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "copychannel",
    aliases: ["cc"],
    description: "Create a new channel in the same category.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return message.reply("❌ You need the **Manage Channels** permission.");

        if (!args[0])
            return message.reply("❌ Usage: `s!copychannel <name> [position]`");

        const name = args[0].toLowerCase();
        const position = Number(args[1]);

        const parent = message.channel.parent;

        try {

            const channel = await message.guild.channels.create({
                name,
                type: ChannelType.GuildText,
                parent: parent ? parent.id : null,
                reason: `Created by ${message.author.tag}`
            });

            if (!isNaN(position))
                await channel.setPosition(position);

            return message.reply(
                `✅ Channel created: ${channel}`
            );

        } catch (err) {

            console.error(err);

            return message.reply("❌ Failed to create the channel.");

        }

    }
};