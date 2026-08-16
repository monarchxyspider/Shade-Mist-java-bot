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

    async execute(client, message, args) {

        try {

            // ==========================================
            // CHECK USER
            // ==========================================

            if (!message.guild) {
                return message.reply(
                    "❌ This command can only be used inside a server."
                );
            }


            // ==========================================
            // CHECK VOICE CHANNEL
            // ==========================================

            const voiceChannel =
                message.member?.voice?.channel;

            if (!voiceChannel) {

                return message.reply(
                    "❌ You need to join a voice channel first."
                );

            }


            // ==========================================
            // CHECK BOT PERMISSIONS
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
                    "❌ I need **Connect** and **Speak** permissions in that voice channel."
                );

            }


            // ==========================================
            // CHECK LINK
            // ==========================================

            const url = args[0];

            if (!url) {

                return message.reply(
                    "❌ Please provide a video link.\n\nExample:\n`s!play https://www.youtube.com/watch?v=...`"
                );

            }


            // ==========================================
            // VALIDATE URL
            // ==========================================

            if (!play.yt_validate(url)) {

                return message.reply(
                    "❌ Please provide a valid YouTube video link."
                );

            }


            // ==========================================
            // JOIN VOICE
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


            await entersState(
                connection,
                VoiceConnectionStatus.Ready,
                30_000
            );


            // ==========================================
            // GET VIDEO INFO
            // ==========================================

            const info =
                await play.video_basic_info(url);

            const title =
                info.video_details.title;


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
                        inputType:
                            stream.type
                    }
                );


            // ==========================================
            // AUDIO PLAYER
            // ==========================================

            const player =
                createAudioPlayer();


            player.play(resource);

            connection.subscribe(player);


            // ==========================================
            // NOW PLAYING
            // ==========================================

            await message.reply(
                `🎵 **Now Playing:** ${title}`
            );


            // ==========================================
            // WHEN FINISHED
            // ==========================================

            player.on(
                AudioPlayerStatus.Idle,
                () => {

                    connection.destroy();

                }
            );


            // ==========================================
            // PLAYER ERROR
            // ==========================================

            player.on(
                "error",
                error => {

                    console.error(
                        "[Music] Player Error:",
                        error
                    );

                    connection.destroy();

                }
            );


            // ==========================================
            // CONNECTION ERROR
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

                        connection.destroy();

                    }

                }
            );


        } catch (error) {

            console.error(
                "[Play Command] Error:",
                error
            );


            return message.reply(
                "❌ I couldn't play that video. Please check the link and try again."
            ).catch(() => {});

        }

    }

};