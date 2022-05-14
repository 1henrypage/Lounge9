const playDL = require('play-dl');
const { entersState, VoiceConnection, VoiceConnectionStatus,joinVoiceChannel } = require('@discordjs/voice');


class GlobalCorePlayer {

    static globalQueue = new Map();


    static async play(interaction) {
        const message = interaction.options.get("input");
        const voiceChannel = interaction.member.voice.channel;
        if (!message) {
            await interaction.reply({content: "ERROR: Enter a valid argument",ephemeral: true});
            return;
        } else if (!voiceChannel) {
            return interaction.reply({content: "ERROR: You must first be in a voice channel to use this command",ephemeral: true});
        } else if (!voiceChannel.permissionsFor(interaction.client.user).has("CONNECT")) {
            return interaction.reply({content: "ERROR: INVALID PERMISSIONS",ephemeral:true});
        }

        const mediaType = await playDL.validate(message.value);
        let songInfo;
        if (mediaType) {
            try {
                songInfo = await typeDelegatorSearcher(message.value,mediaType);
            } catch (error) {
                return interaction.reply({content: "Media type is currently not supported.",ephemeral:true});
            }
        } else {
            return interaction.reply({content: "Nothing found with the search criteria",ephemeral:true});
        }

        if (!this.globalQueue.get(interaction.guild.id)) {
            const queueLiteral = {
                voiceChannel: voiceChannel,
                textChannel: interaction.channel,
                connection: null,
                songs: []
            }

            this.globalQueue.set(interaction.guild.id,queueLiteral);
            songInfo.forEach(e => queueLiteral.songs.push(e));

            try {
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });
                connection.on(VoiceConnectionStatus.Disconnected, async (oldState,newState) => {
                    try {
                        await Promise.race([
                            entersState(connection,VoiceConnectionStatus.Signalling,5_000),
                            entersState(connection,VoiceConnectionStatus.Connecting,5_000),
                        ]);
                    } catch (error) {
                        this.globalQueue.delete(interaction.guild.id);
                        connection.destroy();
                    }
                });
                try {
                    await entersState(connection,VoiceConnectionStatus.Ready, 30e3);
                } catch (error) {
                    this.globalQueue.delete(interaction.guild.id);
                    connection.destroy();
                    throw error;
                }
                queueLiteral.connection = connection;
                videoPlayer(interaction.guild,queueLiteral.songs[0]);
                return interaction.reply({content: "Now playing: " + queueLiteral.songs[0].title,ephemeral:false});
            } catch (err) {
                this.globalQueue.delete(interaction.guild.id);
                return interaction.reply({content: "Error, whilst trying to play the song",ephemeral:false});
            }
        } else {
            currentQueue = this.globalQueue.get(interaction.guild.id).songs;
            songInfo.forEach(e => currentQueue.push(e));
            return interaction.reply({content: "Song(s) Added to Queue",ephemeral:false});
        }
    }









    static async typeDelegatorSearcher(msg,mediaType) {
        switch (mediaType) {
            case "search":
                currentSearch = await playDL.search(msg, { 
                    limit: 1
                });
                return currentSearch;
            case "yt_video":
                currentSearch = await playDL.search(msg); 
                return currentSearch;   
            case "yt_playlist":
                fetchedPlaylist = await playDL.playlist_info(msg);
                currentSearch = await fetchedPlaylist.all_videos();
                return currentSearch;
            // case "sp_track":
            //     currentSearch = await playDL.spotify(msg);
            //     return null; //TODO
            default:
                throw new Error("Type of media is not supported");    
        }
    }

    






}