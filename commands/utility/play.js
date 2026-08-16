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

    async execute(message, args) {

        // ==========================================
        // CHECK LINK
        // ==========================================

        if (!args[0]) {
            return message.reply(
                "❌ Please provide a song/video link.\n\nExample:\n`s!play https://...`"
            );
        }

        const url = args[0];

        // ==========================================
        // CHECK USER VOICE CHANNEL
        // ==========================================

        const voiceChannel = message.member?.voice?.channel;

        if (!voiceChannel) {
            return message.reply(
                "❌ You need to join a voice channel first."
            );
        }

        // ==========================================
        // CHECK BOT PERMISSIONS
        // ==========================================

        const permissions = voiceChannel.permissionsFor(message.client.user);

        if (!permissions?.has("Connect")) {
            return message.reply(
                "❌ I don't have permission to **Connect** to that voice channel."
            );
        }

        if (!permissions?.has("Speak")) {
            return message.reply(
                "❌ I don't have permission to **Speak** in that voice channel."
            );
        }

        // ==========================================
        // CHECK URL
        // ==========================================

        if (!play.yt_validate(url)) {
            return message.reply(
                "❌ Please provide a valid YouTube video link."
            );
        }

        try {

            // ======================================
            // JOIN VOICE CHANNEL
            // ======================================

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            await entersState(
                connection,
                VoiceConnectionStatus.Ready,
                30_000
            );

            // ======================================
            // GET VIDEO INFORMATION
            // ======================================

            const info = await play.video_info(url);

            const title =
                info.video_details?.title ||
                "Unknown Song";

            // ======================================
            // GET AUDIO STREAM
            // ======================================

            const stream = await play.stream(url, {
                quality: 2,
                discordPlayerCompatibility: true
            });

            // ======================================
            // CREATE AUDIO RESOURCE
            // ======================================

            const resource = createAudioResource(
                stream.stream,
                {
                    inputType: stream.type,
                    inlineVolume: true
                }
            );

            resource.volume.setVolume(1);

            // ======================================
            // CREATE PLAYER
            // ======================================

            const player = createAudioPlayer();

            // ======================================
            // PLAY
            // ======================================

            player.play(resource);

            connection.subscribe(player);

            // ======================================
            // NOW PLAYING
            // ======================================

            await message.reply(
                `🎵 **Now Playing**\n` +
                `> ${title}`
            );

            // ======================================
            // SONG FINISHED
            // ======================================

            player.once(
                AudioPlayerStatus.Idle,
                () => {

                    try {
                        connection.destroy();
                    } catch {}

                }
            );

            // ======================================
            // PLAYER ERROR
            // ======================================

            player.on(
                "error",
                error => {

                    console.error(
                        "Audio Player Error:",
                        error
                    );

                    try {
                        connection.destroy();
                    } catch {}

                }
            );

            // ======================================
            // CONNECTION ERROR
            // ======================================

            connection.on(
                "error",
                error => {

                    console.error(
                        "Voice Connection Error:",
                        error
                    );

                }
            );

        } catch (error) {

            console.error(
                "Play Command Error:",
                error
            );

            return message.reply(
                "❌ I couldn't play that video. The link may be unavailable or the audio stream could not be created."
            );
        }
    }
};