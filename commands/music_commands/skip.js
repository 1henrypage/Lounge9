const { SlashCommandBuilder } = require("@discordjs/builders");
const SkipCommandHandler = require("../../classes/music_classes/SkipCommandHandler.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip") 
        .setDescription("skips the current song in the queue"),
    async execute(interaction) {
        return SkipCommandHandler.skip(interaction);
    },
}
