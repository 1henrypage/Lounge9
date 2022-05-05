const { SlashCommandBuilder } = require("@discordjs/builders");
const serverSongQueueObject = require('../../classes/songqueue.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops & Terminates the Music Bots session"),
    async execute(interaction) {
        if (serverSongQueueObject.get(interaction.guild.id)) {
            serverSongQueueObject.get(interaction.guild.id).connection.destroy();
            serverSongQueueObject.delete(interaction.guild.id);
            return interaction.reply({content: "Music Stopped.",ephemeral:true});
        }
        return interaction.reply({content: "No Music Playing",ephemeral:true});

        
    }    
}