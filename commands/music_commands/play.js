const { SlashCommandBuilder } = require('@discordjs/builders');
const serverSongQueueObject = require("../../classes/songqueue.js");
const videoPlayer = require("../../classes/videoplayer.js");
const playDL = require('play-dl');
const { entersState, VoiceConnection, VoiceConnectionStatus,joinVoiceChannel } = require('@discordjs/voice');
const PlayerCommandHandler = require("../../classes/music_classes/PlayCommandHandler.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays the desired song from Youtube/Spotify")
        .addStringOption(option =>
            option.setName("input").setDescription("The input to echo back")),
    async execute(interaction) {
        return PlayerCommandHandler.play(interaction);

    //     const message = interaction.options.get("input");
    //     const voiceChannel = interaction.member.voice.channel;
    //     if (!message) {
    //         await interaction.reply({content: "ERROR: Enter a valid argument",ephemeral: true});
    //         return;
    //     } else if (!voiceChannel) {
    //         return interaction.reply({content: "ERROR: You must first be in a voice channel to use this command",ephemeral: true});
    //     } else if (!voiceChannel.permissionsFor(interaction.client.user).has("CONNECT")) {
    //         return interaction.reply({content: "ERROR: INVALID PERMISSIONS",ephemeral:true});
    //     }

    //     const mediaType = await playDL.validate(message.value);
    //     let songInfo;
    //     if (mediaType) {
    //         try {
    //             songInfo = await typeDelegatorSearcher(message.value,mediaType);
    //         } catch (error) {
    //             return interaction.reply({content: "Media type is currently not supported.",ephemeral:true});
    //         }
    //     } else {
    //         return interaction.reply({content: "Nothing found with the search criteria",ephemeral:true});
    //     }

    //     if (!serverSongQueueObject.get(interaction.guild.id)) {
    //         const queueLiteral = {
    //             voiceChannel: voiceChannel,
    //             textChannel: interaction.channel,
    //             connection: null,
    //             songs: []
    //         }

    //         serverSongQueueObject.set(interaction.guild.id,queueLiteral);
    //         songInfo.forEach(e => queueLiteral.songs.push(e));

    //         try {
    //             const connection = joinVoiceChannel({
    //                 channelId: interaction.member.voice.channel.id,
    //                 guildId: interaction.guild.id,
    //                 adapterCreator: interaction.guild.voiceAdapterCreator
    //             });
    //             connection.on(VoiceConnectionStatus.Disconnected, async (oldState,newState) => {
    //                 try {
    //                     await Promise.race([
    //                         entersState(connection,VoiceConnectionStatus.Signalling,5_000),
    //                         entersState(connection,VoiceConnectionStatus.Connecting,5_000),
    //                     ]);
    //                 } catch (error) {
    //                     serverSongQueueObject.delete(interaction.guild.id);
    //                     connection.destroy();
    //                 }
    //             });
    //             try {
    //                 await entersState(connection,VoiceConnectionStatus.Ready, 30e3);
    //             } catch (error) {
    //                 serverSongQueueObject.delete(interaction.guild.id);
    //                 connection.destroy();
    //                 throw error;
    //             }
    //             queueLiteral.connection = connection;
    //             videoPlayer(interaction.guild,queueLiteral.songs[0]);
    //             return interaction.reply({content: "Now playing: " + queueLiteral.songs[0].title,ephemeral:false});
    //         } catch (err) {
    //             serverSongQueueObject.delete(interaction.guild.id);
    //             return interaction.reply({content: "Error, whilst trying to play the song",ephemeral:false});
    //         }
    //     } else {
    //         currentQueue = serverSongQueueObject.get(interaction.guild.id).songs;
    //         songInfo.forEach(e => currentQueue.push(e));
    //         return interaction.reply({content: "Song(s) Added to Queue",ephemeral:false});
    //     }
    },
}

// async function typeDelegatorSearcher(msg,mediaType) {
//     switch (mediaType) {
//         case "search":
//             currentSearch = await playDL.search(msg, { 
//                 limit: 1
//             });
//             return currentSearch;
//         case "yt_video":
//             currentSearch = await playDL.search(msg); 
//             return currentSearch;   
//         case "yt_playlist":
//             fetchedPlaylist = await playDL.playlist_info(msg);
//             currentSearch = await fetchedPlaylist.all_videos();
//             return currentSearch;
//         // case "sp_track":
//         //     currentSearch = await playDL.spotify(msg);
//         //     return null; //TODO
//         default:
//             throw new Error("Type of media is not supported");    
//     }
// }