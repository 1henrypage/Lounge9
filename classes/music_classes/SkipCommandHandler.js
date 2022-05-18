
const PlayCommandHandler = require('./PlayCommandHandler.js');
const { createAudioPlayer } = require("@discordjs/voice");

class SkipCommandHandler extends PlayCommandHandler {

    /**
     * DO NOT USE THIS
     */
     constructor() {
        if (this.constructor===SkipCommandHandler) {
            throw new Error("Abstract instantiation not permitted");
        }
    }


    static async skip(interaction) {
        if (this.globalQueue.get(interaction.guild.id)) {
            const queueLiteral = this.globalQueue.get(interaction.guild.id);
            if (queueLiteral.songs.length == 0) {
                return interaction.reply({content: "No Music Playing",ephemeral:true});
            } else if (queueLiteral.songs.length == 1) {
                queueLiteral.songs.shift();
                queueLiteral.connection.destroy();
                this.globalQueue.delete(interaction.guild.id);
                return interaction.reply({content: "Song Skipped.",ephemeral:false});
            } else {
                queueLiteral.songs.shift();
                const nextResource = await this.serialiseSong(queueLiteral.songs[0]);
                let player = createAudioPlayer();

                queueLiteral.connection.subscribe(player);
                player.play(nextResource);
                return interaction.reply({content: "Song Skipped.",ephemeral:false});
            }
            
        }
        return interaction.reply({content: "No Music Playing",ephemeral:true});

    }
}

module.exports = SkipCommandHandler;