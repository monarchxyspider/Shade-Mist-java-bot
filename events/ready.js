module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        console.clear();

        console.log("======================================");
        console.log(`Logged in as : ${client.user.tag}`);
        console.log(`Bot Name     : ${client.config.botName}`);
        console.log("Status       : Online");
        console.log("======================================");

        client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: "S!help",
                    type: 0
                }
            ]
        });

    }
};