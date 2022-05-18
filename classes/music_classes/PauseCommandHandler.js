const MusicCommandHandler = require('./MusicClassCommandHandler.js');

class PauseCommandHandler extends MusicCommandHandler {

    /**
     * DO NOT USE THIS
     */
     constructor() {
        if (this.constructor===PauseCommandHandler) {
            throw new Error("Abstract instantiation not permitted");
        }
    }

    /**
     * Business logic for pausing the player
     */
    static async pause(interaction) {
        const songQueue = this.globalQueue.get(interaction.guild.id);
        if (!songQueue || !songQueue.playerHandler) {
            return interaction.reply({content:"There is currently no song playing",ephemeral:true});
        }
        const result = await songQueue.playerHandler.pause();
        switch(result) {
            case 1:
                return interaction.reply({content: "Song paused",ephemeral:false});
            case 0:
                return interaction.reply({content: "Song resumed",ephemeral:false}); 
            case -1: default:
                return interaction.reply({content: "No song was playing",ephemeral:true});    
        }
    }



}

module.exports = PauseCommandHandler;

