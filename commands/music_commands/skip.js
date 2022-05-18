const { SlashCommandBuilder } = require("@discordjs/builders");
const SkipCommandHandler = require("../../classes/music_classes/SkipCommandHandler.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip") 
        .setDescription("Skips the current song in the queue"),
    async execute(interaction) {
        return SkipCommandHandler.skip(interaction);
    },
}
