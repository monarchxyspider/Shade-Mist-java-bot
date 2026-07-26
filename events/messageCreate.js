module.exports = {
    name: "messageCreate",

    async execute(client, message) {

        if (message.author.bot) return;

        if (!message.guild) return;

        const prefix = client.config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command =
            client.commands.get(commandName) ||
            client.commands.get(client.aliases.get(commandName));

        if (!command) return;

        try {
            await command.execute(client, message, args);
        } catch (err) {
            console.error(err);

            return message.reply({
                content: `${client.config.emojis.error} An error occurred while executing this command.`
            });
        }
    }
};