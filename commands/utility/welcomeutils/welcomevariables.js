function replaceVariables(text, member) {

if (!text || !member) {
    return text || "";
}

const guild = member.guild;
const user = member.user;

const values = {
    "{user.mention}":
        `<@${user.id}>`,

    "{user.id}":
        user.id,

    "{user.name}":
        user.username,

    "{user.username}":
        user.username,

    "{user.tag}":
        user.tag,

    "{user.avatar}":
        user.displayAvatarURL({
            extension: "png",
            size: 1024
        }),

    "{user.joinat}":
        `<t:${Math.floor(
            member.joinedTimestamp / 1000
        )}:R>`,

    "{user.createdat}":
        `<t:${Math.floor(
            user.createdTimestamp / 1000
        )}:R>`,

    "{guild.name}":
        guild.name,

    "{guild.id}":
        guild.id,

    "{guild.members}":
        guild.memberCount.toString(),

    "{guild.owner}":
        `<@${guild.ownerId}>`,

    "{guild.icon}":
        guild.iconURL({
            extension: "png",
            size: 1024
        }) || "",

    "{timestamp}":
        `<t:${Math.floor(
            Date.now() / 1000
        )}:R>`,

    "{timestamp.full}":
        `<t:${Math.floor(
            Date.now() / 1000
        )}>`
};

let result = String(text);

for (const [variable, value] of Object.entries(values)) {
    result = result.replaceAll(
        variable,
        value ?? ""
    );
}

return result;

}

function replaceObjectVariables(object, member) {

if (typeof object === "string") {
    return replaceVariables(
        object,
        member
    );
}

if (Array.isArray(object)) {
    return object.map(item =>
        replaceObjectVariables(
            item,
            member
        )
    );
}

if (
    object &&
    typeof object === "object"
) {

    const result = {};

    for (const [key, value] of Object.entries(object)) {

        result[key] =
            replaceObjectVariables(
                value,
                member
            );
    }

    return result;
}

return object;

}

function getVariables() {
return {
user: [
"{user.mention}",
"{user.id}",
"{user.name}",
"{user.username}",
"{user.tag}",
"{user.avatar}",
"{user.joinat}",
"{user.createdat}"
],

    guild: [
        "{guild.name}",
        "{guild.id}",
        "{guild.members}",
        "{guild.owner}",
        "{guild.icon}"
    ],

    general: [
        "{timestamp}",
        "{timestamp.full}"
    ]
};

}

function getVariableList() {
return [
"{user.mention}",
"{user.id}",
"{user.name}",
"{user.username}",
"{user.tag}",
"{user.avatar}",
"{user.joinat}",
"{user.createdat}",
"{guild.name}",
"{guild.id}",
"{guild.members}",
"{guild.owner}",
"{guild.icon}",
"{timestamp}",
"{timestamp.full}"
];
}

module.exports = {
replaceVariables,
replaceObjectVariables,
getVariables,
getVariableList
};