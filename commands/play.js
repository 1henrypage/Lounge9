const { SlashCommandBuilder } = require('@discordjs/builders');
const serverSongQueueObject = require("../classes/songqueue.js");
const videoPlayer = require("../classes/videoplayer.js");
const ytSearch = require('yt-search');
const playDL = require('play-dl');
const { entersState, VoiceConnection, VoiceConnectionStatus,joinVoiceChannel } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays the desired song from Youtube/Spotify")
        .addStringOption(option =>
            option.setName("input").setDescription("The input to echo back")),
    async execute(interaction) {
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

        // {servers: ['323213213213': {serverQueue: [song1,song2]}, '323215454': {serverQueue: [song1,song2]}]}


        const mediaType = await playDL.validate(message.value);
        let songInfo;
        if (mediaType) {
            songInfo = await typeDelegatorSearcher(message.value,mediaType);
        } else {
            return interaction.reply({content: "Nothing found with the search criteria",ephemeral:true});
        }

        if (!serverSongQueueObject.get(interaction.guild.id)) {
            const queueLiteral = {
                voiceChannel: voiceChannel,
                textChannel: interaction.channel,
                connection: null,
                songs: []
            }

            serverSongQueueObject.set(interaction.guild.id,queueLiteral);
            songInfo.forEach(e => queueLiteral.songs.push(e));

            try {
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });
                //FIX: PRINT THE CONNECTION HERE
                try {
                    await entersState(connection,VoiceConnectionStatus.Ready, 30e3);
                } catch (error) {
                    connection.destroy();
                    throw error;
                }
                queueLiteral.connection = connection;
                videoPlayer(interaction.guild,queueLiteral.songs[0]);
            } catch (err) {
                serverSongQueueObject.delete(interaction.guild.id);
                return interaction.reply({content: "Error, whilst trying to play the song",ephemeral:false});
            }
        } else {
            currentQueue = serverSongQueueObject.get(interaction.guild.id).songs;
            // serverSongQueueObject.get(interaction.guild.id).songs.push(song);
            songInfo.forEach(e => currentQueue.push(e));
            return interaction.reply({content: "Song(s) Added to Queue",ephemeral:false});
        }


        return interaction.reply({content: message.value, ephemeral: false});
    },
}

async function typeDelegatorSearcher(msg,mediaType) {
    switch (mediaType) {
        case "search":
            currentSearch = await playDL.search(msg, { 
                limit: 1
            });
            return currentSearch;
        case "yt_video":
            currentSearch = await playDL.search(msg); 
            return currentSearch;    
        default:
            throw new Error("Type of media is not supported");    
    }
}