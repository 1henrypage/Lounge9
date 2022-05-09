

const serverSongQueueObject = require('./songqueue.js');
const playDL = require('play-dl');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('../commands/music_commands/play.js');
const moduleResourceCreator = require('./resourcecreator.js');

module.exports = async (guild,song) => {
    const songQueue = serverSongQueueObject.get(guild.id);

    if (!song) {
        songQueue.connection.destroy();
        serverSongQueueObject.delete(guild.id);
        return;
    }

    let resource = await moduleResourceCreator(song);
    let player = createAudioPlayer();

    songQueue.connection.subscribe(player);
    player.play(resource);

    player.addListener("stateChange", async (oldOne,newOne) => {
        if (newOne.status=="idle") {
            songQueue.songs.shift();
            if (songQueue.songs[0]) {
                nextResource = await moduleResourceCreator(songQueue.songs[0]);
                player.play(nextResource);
            } else {
                songQueue.connection.destroy();
                serverSongQueueObject.delete(guild.id);
                return;
            }
        }
    });

}


