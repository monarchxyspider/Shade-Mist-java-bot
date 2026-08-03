const {
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const WELCOME_CHANNEL = "1526854646373814312";

module.exports = {
    name: "test",
    description: "Test the welcome message.",

    async execute(client, message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ content: `${client.config.emojis.error} Only admins can use this command.` });
        }

        const channel = message.guild.channels.cache.get(WELCOME_CHANNEL);
        if (!channel) {
            return message.reply({ content: `${client.config.emojis.error} Welcome channel not found.` });
        }

        const member = message.member;

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

        const welcomePayload = {
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
                            content: `-# You are the **${message.guild.memberCount}** member of **Shinzo Den**.`
                        },
                        {
                            type: 1,
                            components: buttons.components
                        }
                    ]
                }
            ]
        };

        // ── Send to welcome channel ──────────────────────────
        await channel.send(welcomePayload);

        // ── Send DM to tester ────────────────────────────────
        await message.author.send({
            flags: 1 << 15,
            components: [
                {
                    type: 17,
                    accent_color: 0x57F287,
                    components: [
                        {
                            type: 10,
                            content: `## <a:Verified_Green_tick:1484536303281242164> Welcome Test Triggered`
                        },
                        { type: 14 },
                        {
                            type: 10,
                            content:
`<:message_mist:1488443325303492620> **Channel:** ${channel}
<:red_staff:1484584155273625650> **Triggered By:** ${message.author}
<:target_mist:1488443659182669824> **Server:** ${message.guild.name}
<:stats:1494366143656493268> **Member Count:** \`${message.guild.memberCount}\``
                        },
                        {