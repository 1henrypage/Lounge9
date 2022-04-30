const serverSongQueueObject = require('./songqueue.js');
const ytdl = require("ytdl-core");
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

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
    return ytdl(song.url,{filter:'audioonly'});
}



module.exports = async (guild,song) => {
    const songQueue = serverSongQueueObject.get(guild.id);

    if (!song) {
        songQueue.voiceChannel.leave();
        serverSongQueueObject.delete(guild.id);
        return;
    }

    //https://github.com/fent/node-ytdl-core/issues/331
    const stream = ytdl(song.url, {filter: 'audioonly'});
    //songQueue.connection.play(stream, { seek: 0, volume: 0.5})
    // const subscription = songQueue.connection.subscribe(stream)

    let player = createAudioPlayer();
    songQueue.connection.subscribe(player);

    let resource = createAudioResource(stream);
    player.play(resource);

    console.log("HEREREHRHEHRE")

    player.addListener("stateChange", async (oldOne,newOne) => {
        if (newOne.status=="idle") {
            songQueue.songs.shift();
            player.play(createAudioResource(resourceCreator(songQueue.songs[0])));
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