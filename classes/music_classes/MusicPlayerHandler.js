const playDL = require('play-dl');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const MusicCommandHandler = require('./MusicClassCommandHandler.js');


class MusicPlayerHandler {

    constructor(guild) {
        this.guild = guild;
        this.player = null;
    }

    async play() {
        const serverInfo = MusicCommandHandler.globalQueue.get(this.guild.id);
        if (typeof serverInfo.songs === 'undefined' || serverInfo.songs.length === 0) {
            serverInfo.connection.destroy();
            MusicCommandHandler.globalQueue.delete(guild.id);
        }

        this.player = createAudioPlayer();
        serverInfo.connection.subscribe(this.player);
        console.log(serverInfo.serialisedSongs[0]);
        this.player.play(serverInfo.serialisedSongs[0]);

        this.player.addListener("stateChange", async (oldOne,newOne) => {
            if (newOne.status=="idle") {
                serverInfo.songs.shift();
                serverInfo.serialisedSongs.shift();
                if (serverInfo.serialisedSongs[0]) {
                    this.player.play(serverInfo.serialisedSongs[0]);
                } else {
                    serverInfo.connection.destroy();
                    MusicCommandHandler.globalQueue.delete(this.guild.id);
                    
                }
            }
        });

    }

}

module.exports = MusicPlayerHandler;