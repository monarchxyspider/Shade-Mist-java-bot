const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
    entersState
} = require("@discordjs/voice");

const play = require("play-dl");

module.exports = {

    name: "play",
    aliases: ["p"],

    async execute(client, message, args) {

        // ==========================================
        // SERVER CHECK
        // ==========================================

        if (!message.guild) {
            return message.reply(
                "❌ This command can only be used inside a server."
            );
        }


        // ==========================================
        // VOICE CHANNEL CHECK
        // ==========================================

        const voiceChannel =
            message.member?.voice?.channel;

        if (!voiceChannel) {
            return message.reply(
                "❌ Join a voice channel first."
            );
        }


        // ==========================================
        // LINK CHECK
        // ==========================================

        const url = args[0];

        if (!url) {
            return message.reply(
                "❌ Give me a YouTube video link.\n\nExample:\n`S!play https://youtube.com/watch?v=VIDEO_ID`"
            );
        }


        // ==========================================
        // YOUTUBE URL CHECK
        // ==========================================

        if (!play.yt_validate(url)) {
            return message.reply(
                "❌ Please provide a valid YouTube video link."
            );
        }


        try {

            // ==========================================
            // BOT PERMISSIONS
            // ==========================================

            const permissions =
                voiceChannel.permissionsFor(
                    message.guild.members.me
                );

            if (
                !permissions?.has("Connect") ||
                !permissions?.has("Speak")
            ) {
                return message.reply(
                    "❌ I need **Connect** and **Speak** permissions."
                );
            }


            // ==========================================
            // GET VIDEO INFO
            // ==========================================

            const info =
                await play.video_basic_info(url);

            const title =
                info.video_details.title;


            // ==========================================
            // JOIN VC
            // ==========================================

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


            // Wait until connected

            await entersState(
                connection,
                VoiceConnectionStatus.Ready,
                30_000
            );


            // ==========================================
            // GET AUDIO STREAM
            // ==========================================

            const stream =
                await play.stream(url, {

                    quality: 2,

                    discordPlayerCompatibility: true

                });


            // ==========================================
            // AUDIO RESOURCE
            // ==========================================

            const resource =
                createAudioResource(
                    stream.stream,
                    {
                        inputType: stream.type
                    }
                );


            // ==========================================
            // AUDIO PLAYER
            // ==========================================

            const player =
                createAudioPlayer({

                    behaviors: {
                        noSubscriber:
                            NoSubscriberBehavior.Pause
                    }

                });


            // ==========================================
            // PLAY
            // ==========================================

            connection.subscribe(player);

            player.play(resource);


            // ==========================================
            // NOW PLAYING
            // ==========================================

            await message.reply(
                `🎵 **Now Playing**\n${title}`
            );


            // ==========================================
            // AUDIO FINISHED
            // ==========================================

            player.once(
                AudioPlayerStatus.Idle,
                () => {

                    setTimeout(() => {

                        try {
                            connection.destroy();
                        } catch {}

                    }, 1000);

                }
            );


            // ==========================================
            // PLAYER ERROR
            // ==========================================

            player.on(
                "error",
                error => {

                    console.error(
                        "[Music Player Error]",
                        error
                    );

                    try {
                        connection.destroy();
                    } catch {}

                }
            );


            // ==========================================
            // CONNECTION DISCONNECTED
            // ==========================================

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
                "[Play Command Error]",
                error
            );

            return message.reply(
                "❌ I couldn't play that video. Check the YouTube link and try again."
            ).catch(() => {});

        }

    }

};