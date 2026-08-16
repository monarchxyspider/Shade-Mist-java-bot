const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} = require("@discordjs/voice");

const play = require("play-dl");

module.exports = {

    name: "play",

    aliases: ["p"],

    description: "Play a YouTube video in your voice channel.",

    async execute(client, message, args) {

        try {

            // ==================================================
            // SERVER CHECK
            // ==================================================

            if (!message.guild) {

                return message.reply(
                    `${client.config.emojis.error} This command can only be used inside a server.`
                );

            }


            // ==================================================
            // GET MEMBER DIRECTLY FROM GUILD
            // ==================================================

            const member =
                await message.guild.members.fetch(
                    message.author.id
                );


            // ==================================================
            // VOICE CHANNEL CHECK
            // ==================================================

            const voiceChannel =
                member.voice.channel;


            if (!voiceChannel) {

                return message.reply(
                    `${client.config.emojis.error} You need to join a voice channel first.`
                );

            }


            // ==================================================
            // BOT MEMBER
            // ==================================================

            const botMember =
                message.guild.members.me ||
                await message.guild.members.fetch(
                    client.user.id
                );


            // ==================================================
            // PERMISSIONS
            // ==================================================

            const permissions =
                voiceChannel.permissionsFor(
                    botMember
                );


            if (
                !permissions ||
                !permissions.has("Connect") ||
                !permissions.has("Speak")
            ) {

                return message.reply(
                    `${client.config.emojis.error} I need **Connect** and **Speak** permissions in your voice channel.`
                );

            }


            // ==================================================
            // LINK CHECK
            // ==================================================

            const url =
                args[0];


            if (!url) {

                return message.reply(
                    `${client.config.emojis.error} Please provide a YouTube video link.\n\n` +
                    `Example:\n\`S!play https://www.youtube.com/watch?v=VIDEO_ID\``
                );

            }


            // ==================================================
            // YOUTUBE URL CHECK
            // ==================================================

            const validation =
                play.yt_validate(url);


            if (validation !== "video") {

                return message.reply(
                    `${client.config.emojis.error} Please provide a valid **YouTube video link**.`
                );

            }


            // ==================================================
            // JOIN VOICE
            // ==================================================

            const connection =
                joinVoiceChannel({

                    channelId:
                        voiceChannel.id,

                    guildId:
                        message.guild.id,

                    adapterCreator:
                        message.guild.voiceAdapterCreator,

                    selfDeaf: true

                });


            // ==================================================
            // WAIT FOR CONNECTION
            // ==================================================

            await entersState(
                connection,
                VoiceConnectionStatus.Ready,
                30_000
            );


            // ==================================================
            // GET VIDEO INFORMATION
            // ==================================================

            const info =
                await play.video_basic_info(url);


            const title =
                info.video_details.title;


            // ==================================================
            // GET AUDIO STREAM
            // ==================================================

            const stream =
                await play.stream(
                    url,
                    {
                        quality: 2,

                        discordPlayerCompatibility:
                            true
                    }
                );


            // ==================================================
            // AUDIO RESOURCE
            // ==================================================

            const resource =
                createAudioResource(
                    stream.stream,
                    {
                        inputType:
                            stream.type
                    }
                );


            // ==================================================
            // AUDIO PLAYER
            // ==================================================

            const player =
                createAudioPlayer();


            // ==================================================
            // SUBSCRIBE
            // ==================================================

            connection.subscribe(
                player
            );


            // ==================================================
            // PLAY
            // ==================================================

            player.play(
                resource
            );


            // ==================================================
            // NOW PLAYING
            // ==================================================

            await message.reply(
                `${client.config.emojis.success} **Now Playing**\n\n` +
                `🎵 **${title}**`
            );


            // ==================================================
            // SONG FINISHED
            // ==================================================

            player.on(
                AudioPlayerStatus.Idle,
                () => {

                    try {
                        connection.destroy();
                    } catch {}

                }
            );


            // ==================================================
            // PLAYER ERROR
            // ==================================================

            player.on(
                "error",
                error => {

                    console.error(
                        "[Music] Audio Player Error:",
                        error
                    );

                    try {
                        connection.destroy();
                    } catch {}

                }
            );


            // ==================================================
            // VOICE DISCONNECTED
            // ==================================================

            connection.on(
                VoiceConnectionStatus.Disconnected,
                async () => {

                    try {

                        await Promise.race([

                            entersState(
                                connection,
                                VoiceConnectionStatus.Signalling,
                                5_000
                            ),

                            entersState(
                                connection,
                                VoiceConnectionStatus.Connecting,
                                5_000
                            )

                        ]);

                    } catch {

                        try {
                            connection.destroy();
                        } catch {}

                    }

                }
            );


        } catch (error) {

            console.error(
                "[Play Command] Error:",
                error
            );


            return message.reply(
                `${client.config.emojis.error} I couldn't play that video.\nPlease check the YouTube link and try again.`
            ).catch(() => {});

        }

    }

};