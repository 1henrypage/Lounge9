
const playDL = require('play-dl');
const {createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const { entersState, VoiceConnection, VoiceConnectionStatus,joinVoiceChannel } = require('@discordjs/voice');

/**
 * Abstract Parent Class which contains the global queue of songs 
 * Behaviour that applies to all commands should be added here 
 */
class MusicCommandHandler {

    static globalQueue;
    static { 
        this.globalQueue = new Map();
    }

    /**
     * DO NOT USE THIS
     */
    constructor() {
        if (this.constructor===MusicCommandHandler) {
            throw new Error("Abstract instantiation not permitted");
        }
    }

    /**
     * Creates a resource stream from the given video
     * 
     * @param {*} song The song metadata generated by the playDL API
     * @returns The created audio resource FROM THE GIVEN URL 
     */
     static async serialiseSong(song) {
        let stream = await playDL.stream(song.url);

        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
        return resource;
    }

    /**
     * Destroys the queue for the server - prevents memory leaks
     * @param {} guild The server to destroy the queue for 
     */
    static destroyQueue(guild) {
        const literal = this.globalQueue.get(guild.id);
        literal.playerHandler.stop();
        literal.playerHandler=null;
        literal.connection.destroy();
        literal.connection=null;
        this.globalQueue.delete(guild.id);
    }

    
}

module.exports = MusicCommandHandler;