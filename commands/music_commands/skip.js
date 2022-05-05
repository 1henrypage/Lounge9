
const { SlashCommandBuilder } = require("@discordjs/builders");
const serverSongQueueObject = require('../../classes/songqueue.js');
const moduleResourceCreator = require('../../classes/resourcecreator.js');
const { createAudioPlayer } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip") // consider 0,1,N
        .setDescription("skips the current song in the queue"),
    async execute(interaction) {
        if (serverSongQueueObject.get(interaction.guild.id)) {
            const queueLiteral = serverSongQueueObject.get(interaction.guild.id);
            if (queueLiteral.songs.length == 0) {
                return interaction.reply({content: "No Music Playing",ephemeral:true});
            } else if (queueLiteral.songs.length == 1) {
                queueLiteral.songs.shift();
                queueLiteral.connection.destroy();
                serverSongQueueObject.delete(interaction.guild.id);
                return interaction.reply({content: "Song Skipped!",ephemeral:false});
            } else {
                queueLiteral.songs.shift();
                nextResource = await moduleResourceCreator(queueLiteral.songs[0]);
                let player = createAudioPlayer();

                queueLiteral.connection.subscribe(player);
                player.play(nextResource);
                return interaction.reply({content: "Song Skipped!",ephemeral:false});
            }


        }
        return interaction.reply({content: "No Music Playing",ephemeral:true});
    }    







}
