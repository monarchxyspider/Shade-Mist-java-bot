const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const commandsPath = path.join(__dirname, "..", "commands");

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const files = fs
            .readdirSync(path.join(commandsPath, folder))
            .filter(file => file.endsWith(".js"));

        for (const file of files) {
            const command = require(path.join(commandsPath, folder, file));

            client.commands.set(command.name, command);

            if (command.aliases) {
                for (const alias of command.aliases) {
                    client.aliases.set(alias, command.name);
                }
            }

            console.log(`✔ Loaded Command: ${command.name}`);
        }
    }
};