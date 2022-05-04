const serverSongQueueObject = require('./songqueue.js');
const playDL = require('play-dl');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('../commands/play.js');

module.exports = async (guild,song) => {
    const songQueue = serverSongQueueObject.get(guild.id);

    if (!song) {
        songQueue.connection.destroy();
        serverSongQueueObject.delete(guild.id);
        return;
    }

    let resource = await resourceCreator(song);
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

}


//kick behaviour
//not in channel 

async function resourceCreator(song) {
    const stream = await playDL.stream(song.url);
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });
    return resource;
}

