const { SlashCommandBuilder } = require("@discordjs/builders");
const StopCommandHandler = require('../../classes/music_classes/StopCommandHandler.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops & Terminates the Music Bots session"),
    async execute(interaction) {
        return StopCommandHandler.stop(interaction);
    },    
}