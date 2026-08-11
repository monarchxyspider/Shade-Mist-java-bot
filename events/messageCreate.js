module.exports = {
    name: "messageCreate",

    async execute(client, message) {

        // Ignore bots
        if (message.author.bot) return;

        // Server commands only
        if (!message.guild) return;

        // ==========================================
        // PREFIXES
        // ==========================================

        const prefixes = Array.isArray(client.config.prefix)
            ? client.config.prefix
            : [client.config.prefix];

        // Find which prefix was used
        const usedPrefix = prefixes.find(prefix =>
            message.content.startsWith(prefix)
        );

        // No valid prefix
        if (!usedPrefix) return;

        // ==========================================
        // ARGUMENTS
        // ==========================================

        const args = message.content
            .slice(usedPrefix.length)
            .trim()
            .split(/ +/)
            .filter(Boolean);

        // Empty command
        if (!args.length) return;

        // ==========================================
        // COMMAND NAME
        // ==========================================

        const commandName =
            args.shift().toLowerCase();

        // ==========================================
        // FIND COMMAND
        // ==========================================

        const command =
            client.commands.get(commandName) ||
            client.commands.get(
                client.aliases.get(commandName)
            );

        // Command doesn't exist
        if (!command) return;

        // ==========================================
        // EXECUTE
        // ==========================================

        try {

            await command.execute(
                client,
                message,
                args
            );

        } catch (err) {

            console.error(
                `Error executing ${commandName}:`,
                err
            );

            return message.reply({
                content:
                    `${client.config.emojis.error} An error occurred while executing this command.`
            });
        }
    }
};