const { SlashCommandBuilder } = require('@discordjs/builders');
const serverSongQueueObject = require("../classes/songqueue.js");
const videoPlayer = require("../classes/videoplayer.js");
const ytdl = require("ytdl-core");
const ytSearch = require('yt-search');
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


        let song = {};
        console.log(message.value)
        if (ytdl.validateURL(message.value)) {
            const songInfo = await ytdl.getInfo(message.value);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            }
        } else {
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }


            const video = await videoFinder(message.value);
            if (video) {
                song = {
                    title: video.title,
                    url: video.url
                }
            } else {
                interaction.reply({content: "ERROR: No videos found with the current search criteria",ephemeral:true});
            }
        }

        


        //interaction.guild.i
        if (!serverSongQueueObject.get(interaction.guild.id)) {
            const queueLiteral = {
                voiceChannel: voiceChannel,
                textChannel: interaction.channel,
                connection: null,
                songs: []
            }

            serverSongQueueObject.set(interaction.guild.id,queueLiteral);
            queueLiteral.songs.push(song);


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
            serverSongQueueObject.get(interaction.guild.id).songs.push(song);
            return interaction.reply({content: song.title + " Added to Queue",ephemeral:false});
        }


        return interaction.reply({content: message.value, ephemeral: false});
    },
}