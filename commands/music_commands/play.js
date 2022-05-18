const { SlashCommandBuilder } = require('@discordjs/builders');
const PlayerCommandHandler = require("../../classes/music_classes/PlayCommandHandler.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays the desired song from Youtube/Spotify")
        .addStringOption(option =>
            option.setName("input").setDescription("The input to echo back")),
    async execute(interaction) {
        return PlayerCommandHandler.play(interaction);
    },
}

