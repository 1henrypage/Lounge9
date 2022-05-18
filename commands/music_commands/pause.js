const { SlashCommandBuilder } = require("@discordjs/builders");
const PauseCommandHandler = require('../../classes/music_classes/PauseCommandHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause") 
        .setDescription("(Un)pauses the current song"),
    async execute(interaction) {
        return PauseCommandHandler.pause(interaction);
    },
}
