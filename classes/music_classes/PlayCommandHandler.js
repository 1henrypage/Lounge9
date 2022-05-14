const MusicCommandHandler = require('./MusicClassCommandHandler.js');

class PlayerCommandHandler extends MusicCommandHandler {

    /**
     * DO NOT USE THIS
     */
     constructor() {
        if (this.constructor===PlayerCommandHandler) {
            throw new Error("Abstract instantiation not permitted");
        }
    }


    

}