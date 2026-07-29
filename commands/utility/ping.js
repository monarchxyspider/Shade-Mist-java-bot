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

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Support Server")
                .setEmoji("<:list:1494365866916053022>")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/54vJcse3")
        );

        return message.reply({
            flags: 1 << 15,
            components: [
                {
                    type: 17,
                    accent_color: 0xE53935,
                    components: [
                        {
                            type: 10,
                            content: `## ${client.config.emojis.stats}  **${client.config.botName}**`
                        },
                        {
                            type: 10,
                            content: `Your all-in-one server Domain.`
                        },
                        { type: 14 },
                        {
                            type: 10,
                            content: [
                                `**Prefix:** \`s!\``,
                                `**Help:** \`s!help\``,
                                `**Server:** \`${message.guild.name}\``,
                                `**Status:** <:upgrade:1494364520850784348> `,
                                `$<:ping:1494366308601561310> **Ping:** \`${client.ws.ping}ms\``,
                                `${client.config.emojis.member} **Users:** \`${client.users.cache.size}\``
                            ].join("\n")
                        },
                        { type: 14 },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Support Server",
                                    emoji: { id: "1494365866916053022", name: "list" },
                                    style: 5,
                                    url: "https://discord.gg/uW34DMUu8"
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
};