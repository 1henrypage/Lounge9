const serverSongQueueObject = require('./songqueue.js');
const ytdl = require("ytdl-core");
const playDL = require('play-dl');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('../commands/play.js');

// const connectToChannel = async (connnection,channel) => {
//     try {
//         await entersState(connnection,VoiceConnectionStatus.Ready, 30e3);
//         return connection;
//     } catch (error) {
//         connnection.destroy();
//         throw error;
//     }
// }

async function resourceCreator(song) {
    const stream = await playDL.stream(song.url);
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });
    return resource;
}



module.exports = async (guild,song) => {
    const songQueue = serverSongQueueObject.get(guild.id);

    if (!song) {
        songQueue.voiceChannel.leave();
        serverSongQueueObject.delete(guild.id);
        return;
    }

    const stream = await playDL.stream(song.url);
    //songQueue.connection.play(stream, { seek: 0, volume: 0.5})
    // const subscription = songQueue.connection.subscribe(stream)
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    let player = createAudioPlayer();

    songQueue.connection.subscribe(player);
    player.play(resource);

    player.addListener("stateChange", async (oldOne,newOne) => {
        if (newOne.status=="idle") {
            songQueue.songs.shift();
            if (songQueue.songs[0]) {
                nextResource = await resourceCreator(songQueue.songs[0]);
                player.play(nextResource);
            } else {
                songQueue.connection.destroy();
                serverSongQueueObject.delete(guild.id);
                return;
            }
        }
    });

    // player.on(AudioPlayerStatus.Idle, async () => {
    //     songQueue.songs.shift();
    //     videoPlayer(guild,songQueue.songs[0]);
    // });
    // .on("finish", () => {
    //     songQueue.songs.shift();
    //     videoPlayer(guild,songQueue.songs[0]);
    // });
    await songQueue.textChannel.send({content: "Now playing some other song",ephemeral:false});
}