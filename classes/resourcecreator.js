const playDL = require('play-dl');
const {createAudioPlayer, createAudioResource} = require('@discordjs/voice');

module.exports = (async (song) => {
    const stream = await playDL.stream(song.url);
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });
    return resource;
});