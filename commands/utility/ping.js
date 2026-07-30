const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["<@1481550443149529270>"],
    description: "Display bot latency.",

    async execute(client, message) {

        return message.reply({
            flags: 1 << 15,
            components: [
                {
                    type: 17,
                    accent_color: 0xE53935,
                    components: [
                        {
                            type: 10,
                            content: `## ${client.config.emojis.stats} **${client.config.botName}**`
                        },
                        {
                            type: 10,
                            content: `Your all-in-one server Domain.`
                        },
                        {
                            type: 14
                        },
                        {
                            type: 10,
                            content: [
                                `**Prefix:** \`s!\``,
                                `**Help:** \`s!help\``,
                                `**Server:** \`${message.guild.name}\``,
                                `**Status:** <:upgrade:1494364520850784348>`,
                                `<:ping:1494366308601561310> **Ping:** \`${client.ws.ping}ms\``,
                                `${client.config.emojis.member} **Users:** \`${client.users.cache.size}\``,
                                    `**[Privacy](https://monarchxyspider.github.io/Shademist-docs/privacy.html)**``**•[Terms](https://monarchxyspider.github.io/Shademist-docs/terms.html)**`
                            ].join("\n")
                        },
                        {
                            type: 14
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 5,
                                    label: "Support Server",
                                    emoji: {
                                        id: "1494365866916053022",
                                        name: "list"
                                    },
                                    url: "https://discord.gg/uW34DMUu8"
                                },
                                {
                                    type: 2,
                                    style: 5,
                                    label: "Add Bot",
                                    emoji: {
                                        id: "1486921444045885490",
                                        name: "adds"
                                    },
                                    url: "https://discord.com/oauth2/authorize?client_id=1481550443149529270&permissions=8&integration_type=0&scope=bot+applications.commands"
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
};