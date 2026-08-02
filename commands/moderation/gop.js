const {
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "clonecategory",
    aliases: ["ccategory", "catclone"],
    description: "Clone a category.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply("❌ You need the **Manage Channels** permission.");
        }

        const category =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]);

        if (!category) {
            return message.reply("❌ Please provide a valid category ID or mention a category.");
        }

        if (category.type !== 4) {
            return message.reply("❌ That channel is not a category.");
        }

        try {

            const cloned = await category.clone({
                name: category.name,
                reason: `Category cloned by ${message.author.tag}`
            });

            await cloned.setPosition(category.position + 1);

            return message.reply(
                `✅ Successfully cloned **${category.name}**.\nNew Category: <#${cloned.id}>`
            );

        } catch (err) {

            console.error(err);

            return message.reply("❌ Failed to clone the category.");

        }

    }
};