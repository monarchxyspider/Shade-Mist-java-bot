const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const folders = fs.readdirSync("./commands");

    for (const folder of folders) {
        const commandFiles = fs
            .readdirSync(path.join("./commands", folder))
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const command = require(`../commands/${folder}/${file}`);

            client.commands.set(command.name, command);

            if (command.aliases) {
                command.aliases.forEach(alias => {
                    client.aliases.set(alias, command.name);
                });
            }

            console.log(`✔ Loaded ${command.name}`);
        }
    }
};