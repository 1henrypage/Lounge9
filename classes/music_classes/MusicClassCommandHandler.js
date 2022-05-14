
const playDL = require('play-dl');
const {createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const { entersState, VoiceConnection, VoiceConnectionStatus,joinVoiceChannel } = require('@discordjs/voice');

class MusicCommandHandler {

    static #globalQueue;
    static { // static initialiser
        this.#globalQueue = new Map();
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
     * Getter for the global queue
     */
    get queue() {
        return this.#globalQueue;
    }

    /**
     * Creates a resource stream from the given video
     * 
     * @param {*} song The song metadata generated by the playDL API
     * @returns The created audio resource 
     */
    static async serialiseSong(song) {
        const stream = await playDL.stream(song.url);
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
        return resource;
    }
}

module.exports = MusicCommandHandler;