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
            return;
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

    /**
     * Pauses/Unpauses the current player
     * 
     * @returns 1 if it was previously playing, 0 if it was paused,
     * -1 if it was in another state
     */
    async pause() {
        if (!this.player) return;
        let state = this.player.state.status;
        if (state==AudioPlayerStatus.Playing) {
            this.player.pause();
            return 1;
        } else if (state==AudioPlayerStatus.Paused) {
            this.player.unpause();
            return 0;
        }
        return -1;
    }

    /**
     * Changes the resource of the active player to another one. 
     * 
     * @param {*} nextResource The next resource to be played 
     */
    async changeSrc(nextResource) {
        if (this.player==null) {
            throw new Error("Music player not initialised")
        }

        this.player.stop(false);
        this.player.play(nextResource);
    }

    async 

}

module.exports = MusicPlayerHandler;