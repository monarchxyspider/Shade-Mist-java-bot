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
                            content: `Your all-in-one server Domain.

<:Star_monarchs:1494580479821615196> [Privacy Policy](https://monarchxyspider.github.io/Shademist-docs/privacy.html)
<:kinights_poll:1487074927671644211> [Terms of Service](https://monarchxyspider.github.io/Shademist-docs/terms.html)`
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
                                `${client.config.emojis.member} **Users:** \`${client.users.cache.size}\``
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
                                        name: "<:adds:1486921444045885490> "
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