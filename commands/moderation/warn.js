const {
EmbedBuilder,
PermissionFlagsBits
} = require("discord.js");

module.exports = {
name: "warn",
aliases: ["w"],
description: "Warn a member.",

async execute(client, message, args) {  

    if (  
        !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)  
    ) {  
        return message.reply({  
            content: `${client.config.emojis.error} You don't have permission to use this command.`  
        });  
    }  

    const member =  
        message.mentions.members.first() ||  
        await message.guild.members.fetch(args[0]).catch(() => null);  

    if (!member) {  
        return message.reply({  
            content: `${client.config.emojis.error} Please mention a valid member.`  
        });  
    }  

    if (member.id === message.author.id) {  
        return message.reply({  
            content: `${client.config.emojis.error} You cannot warn yourself.`  
        });  
    }  

    if (member.id === client.user.id) {  
        return message.reply({  
            content: `${client.config.emojis.error} I cannot warn myself.`  
        });  
    }  

    if (member.id === message.guild.ownerId) {  
        return message.reply({  
            content: `${client.config.emojis.error} You cannot warn the server owner.`  
        });  
    }  

    if (member.roles.highest.position >= message.member.roles.highest.position) {  
        return message.reply({  
            content: `${client.config.emojis.error} This member has an equal or higher role than you.`  
        });  
    }  

    const reasonIndex = args.findIndex(arg => arg.toLowerCase() === "?r");  

    const reason =  
        reasonIndex === -1  
            ? "No reason provided."  
            : args.slice(reasonIndex + 1).join(" ") || "No reason provided.";  

    try {  

        // ── DM to warned member (v2 embed) ──────────────────────────────  
        await member.send({  
            flags: 1 << 15,  
            components: [  
                {  
                    type: 17,  
                    accent_color: 0xFFA500,  
                    components: [  
                        {  
                            type: 10,  
                            content: `<:alert:1480938100401111091> **You have been warned in ${message.guild.name}**`  
                        },  
                        {  
                            type: 14  
                        },  
                        {  
                            type: 10,  
                            content: `<:information:1487486402244382790> **Reason:** ${reason}\n<:red_staff:1484584155273625650> **Moderator:** ${message.author.tag}`
 
                        },  
                        {  
                            type: 14  
                        },  
                        {  
                            type: 10,  
                            content: `-# ${client.config.botName} • Warning Notice`  
                        }  
                    ]  
                }  
            ]  
        }).catch(() => {});  

        // ── Success reply (Wick style) ───────────────────────────────────  
        return message.reply({  
            flags: 1 << 15,  
            components: [  
                {  
                    type: 17,  
                    components: [  
                        {  
                            type: 10,  
                            content: `**Warn result:**`  
                        },  
                        {  
                            type: 14  
                        },  
                        {  
                            type: 10,  
                            content: `<:information:1487486402244382790> **Reason:** ${reason}\n<:red_staff:1484584155273625650> **Moderator:**\n${message.author}`  
                        },  
                        {  
                            type: 14  
                        },  
                        {  
                            type: 10,  
                            content: `**Warned:**\n<:green_tick:1530887008581587095>  ${member.user.username}\n[${member.id}]`  
                        }  
                    ]  
                }  
            ]  
        });  

    } catch (err) {  

        console.error(err);  

        return message.reply({  
            content: `${client.config.emojis.error} Failed to warn this member.`  
        });  

    }  

}

}; 