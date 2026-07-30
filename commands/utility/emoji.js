module.exports = {
    name: "emoji",
    aliases: ["e"],
    description: "Get the raw format of a server emoji.",

    async execute(client, message, args) {

        if (!args.length) {
            return message.reply(
                `${client.config.emojis.error} Please provide an emoji name.\nExample: \`s!emoji :happy:\``
            );
        }

        const input = args[0].replace(/:/g, "").toLowerCase();

        const emoji = message.guild.emojis.cache.find(
            e => e.name.toLowerCase() === input
        );

        if (!emoji) {
            return message.reply(
                `${client.config.emojis.error} Emoji not found in this server.`
            );
        }

        const raw = emoji.animated
            ? `<a:${emoji.name}:${emoji.id}>`
            : `<:${emoji.name}:${emoji.id}>`;

        return message.reply({
            content: raw,
            allowedMentions: {
                repliedUser: false
            }
        });

    }
};