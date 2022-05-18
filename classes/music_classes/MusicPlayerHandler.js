const playDL = require('play-dl');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const MusicCommandHandler = require('./MusicClassCommandHandler.js');

/**
 * Entity for the actual music player object
 */
class MusicPlayerHandler {

    /**
     * Constructor for the MusicPlayerHandler
     * 
     * @param {*} guild The server which the music is being played on 
     */
    constructor(guild) {
        this.guild = guild;
        this.player = null;
    }

    /**
     * Method to play the next resource on the server with the player held in this object
     */
    async play() {
        const serverInfo = MusicCommandHandler.globalQueue.get(this.guild.id);

        if (typeof serverInfo.songs === 'undefined' || serverInfo.songs.length === 0) {
            serverInfo.connection.destroy();
            MusicCommandHandler.globalQueue.delete(guild.id);
        }

        let resource = await MusicCommandHandler.serialiseSong(serverInfo.songs[0]);


        this.player = createAudioPlayer();
        serverInfo.connection.subscribe(this.player);
        
        this.player.play(resource);

        this.player.addListener("stateChange", async (oldOne,newOne) => {
            if (newOne.status=="idle") {
                serverInfo.songs.shift();
                if (serverInfo.songs[0]) {
                    let newResource = await MusicCommandHandler.serialiseSong(serverInfo.songs[0]);
                    this.player.play(newResource);
                } else {
                    serverInfo.connection.destroy();
                    MusicCommandHandler.globalQueue.delete(this.guild.id);
                    
                }
            }
        });
    }

}

module.exports = MusicPlayerHandler;