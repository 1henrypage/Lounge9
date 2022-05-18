
const MusicCommandHandler = require('./MusicClassCommandHandler.js');

/**
 * Wrapper Class for Stop Command
 */
class StopCommandHandler extends MusicCommandHandler {

    /**
     * DO NOT USE THIS
     */
     constructor() {
        if (this.constructor===StopCommandHandler) {
            throw new Error("Abstract instantiation not permitted");
        }
    }

    /**
     * Business Logic for Stop Command
     * 
     * @param {*} interaction The interaction of the user,channel,voice channel
     * @returns A reply to the bot after the command was successfully executed. 
     */
    static async stop(interaction) {
        if (this.globalQueue.get(interaction.guild.id)) {
            this.globalQueue.get(interaction.guild.id).connection.destroy();
            this.globalQueue.delete(interaction.guild.id);
            return interaction.reply({content: "Music Stopped",ephemeral:false});
        }
        return interaction.reply({content: "No Music Playing",ephemeral: true});
    }
}

module.exports = StopCommandHandler;