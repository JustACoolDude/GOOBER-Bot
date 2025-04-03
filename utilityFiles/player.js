/*Player Class constructor.
Some values hardcoded since a) there's not much reason to have player input for those values and b) worst case scenario can load your previous save or alter score accordingly.
Functions were made here but were mostly for early testing purposes.

@param {String} name = Discord Username
@param {String} realName = Player's real name
@param {Int} score = Player's score
@param (Map} scoreHistory = A map that details all score changes to a player. Used to double check that you haven't made a mistake somewhere. Mostly for console usage with /print.
@param (Int} scoreHistoryKey = The key to use for scoreHistory, incases by itself with the /score add/subtract commands.

*/


class Player {
    constructor (name, realName, score, scoreHistory, scoreHistoryKey){
        this.name = name;
        this.realName = realName;
        this.score = 0;
        this.scoreHistory = new Map();
        this.scoreHistoryKey = 0;
        //this.playerIndex = playerIndex;
    }
    
    // Misc. Commands for class testing within this script
    addPlayerScore(scoreToAdd, comment){
        if (comment == null){
            comment = "no comment/addscore";
        }
        this.score += scoreToAdd;
        this.scoreHistory.set(this.scoreHistoryKey.toString(), scoreToAdd.toString() + " " + comment);
        this.scoreHistoryKey += 1;
    }

    removePlayerScore(scoreToRemove, comment){
        if (comment == null){
            comment = "no comment";
        }
        this.score -= scoreToRemove;
        this.scoreHistory.set(this.scoreHistoryKey.toString(), "-" + scoreToRemove.toString() + " " + comment);
        this.scoreHistoryKey += 1;
    }
   
    setPlayerindex(setIndex){
        this.playerIndex = setIndex;
    }

    getScoreHistory(){
        console.log(this.scoreHistory);
    }
}

module.exports.Player = Player;