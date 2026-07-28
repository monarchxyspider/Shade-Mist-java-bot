const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "purge",
    aliases: ["p"],
    description: "Delete messages.",

    async execute(client, message, args) {

        if (
            !message.member.permissions.has(PermissionFlagsBits.ManageMessages)
            // Future ShadeMist Permission:
            // && !client.perms.has(message.author.id, "purge")
        ) {
            return message.reply({
                content: `${client.config.emojis.error} You don't have permission to use this command.`
            });
        }

        if (
            !message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)
        ) {
            return message.reply({
                content: `${client.config.emojis.error} I don't have the **Manage Messages** permission.`
            });
        }

        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply({
                content: `${client.config.emojis.error} Please provide a number between **1** and **100**.`
            });
        }

        const target =
            message.mentions.users.first() ||
            (args[1]?.toLowerCase() === "bots" ? "bots" : null);

        try {

            const fetched = await message.channel.messages.fetch({
                limit: 100
            });

            let messages = fetched;

            let type = "All Messages";

            if (target === "bots") {
                messages = fetched.filter(m => m.author.bot).first(amount);
                type = "Server Bots";
            }

            else if (target) {
                messages = fetched.filter(m => m.author.id === target.id).first(amount);
                type = "User Messages";
            }

            else {
                messages = fetched.first(amount);
            }
            const deleted = await message.channel.bulkDelete(messages, true);

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setAuthor({
                    name: `${client.config.botName} • Purge`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`

<:information:1487486402244382790> **Channel**: ${message.channel}
<:red_staff:1484584155273625650>**Moderator**: ${message.author}
${client.config.emojis.fetch} **Messages Fetched**: \`${fetched.size}\`
${client.config.emojis.message} **Purge Request**: \`${amount}\`
<:mute:1488895692784275630> **Messages Identified**: \`${messages.length}\`
<:trashcan:1531569722460471306> **Messages Purged**: \`${deleted.size}\`
`)
                .setFooter({
                    text: `${client.config.botName} • Moderation`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            const reply = await message.channel.send({
                embeds: [embed]
            });

            setTimeout(() => {
                reply.delete().catch(() => {});
            }, 5000);

        } catch (err) {

            console.error(err);

            return message.reply({
                content: `${client.config.emojis.error} Failed to purge messages.`
            });

        }

    }

};