const {
    Events,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const WELCOME_CHANNEL = "1526854646373814312";

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
        if (!channel) return;

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Rules")
                    .setEmoji({ id: "1472901973400359007", animated: true })
                    .setURL("https://discord.com/channels/1470960049265574032/1470960050339184804"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Self Roles")
                    .setEmoji({ id: "1472901369060135033" })
                    .setURL("https://discord.com/channels/1470960049265574032/1526854844088975380"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Announcements")
                    .setEmoji({ id: "1472903994446975079", animated: true })
                    .setURL("https://discord.com/channels/1470960049265574032/1471087385235161149")
            );

        await channel.send({
            content: `${member}`,
            flags: 1 << 15,
            components: [
                {
                    type: 17,
                    accent_color: 0xFF0000,
                    components: [
                        {
                            type: 10,
                            content: `# <a:w2:1482642554989318194> Welcome To The SHINZO_PLAYZ <a:RedCrown:1482388213300592662>`
                        },
                        { type: 14 },
                        {
                            type: 10,
                            content:
`<a:RedBook:1472901973400359007> **__Read The Rules In 『🍁[︱rules』](https://discord.com/channels/1479436662248312915/1479436664911827026)__**
<:Minecraft_Heart:1472901369060135033> **__Check out these!__**

## __≪━━━━━◈━━━━━≫__

> <a:ww:1484430425370656809> **Announcement <:announce:1494369218634842312>**
> __**『🍁[︱announcement』](https://discord.com/channels/1470960049265574032/1471087385235161149)**__

> <a:ww:1484430425370656809> **Self Roles <:monarchs_list:1494580552366428310>**
> __**☃️ [ゝʀᴏʟᴇꜱ⌝](https://discord.com/channels/1479436662248312915/1479436664911827027)**__`
                        },
                        { type: 14 },
                        {
                            type: 10,
                            content:
`**\`\`\`SHINZO DEN\`\`\`**
<a:guitar:1486017856553357383> ***Thanks for joining our community!***
<a:guitar:1486017856553357383> **Welcome to the Shinzo Army!** ${member}`
                        },
                        {
                            type: 12,
                            items: [
                                {
                                    media: {
                                        url: "https://cdn.discordapp.com/attachments/1470960050754420841/1527322269741879316/standard_14.gif"
                                    }
                                }
                            ]
                        },
                        {
                            type: 10,
                            content: `-# You are the **${member.guild.memberCount}** member of **Shinzo Den**.`
                        },
                        {
                            type: 1,
                            components: buttons.components
                        }
                    ]
                }
            ]
        });
    }
};