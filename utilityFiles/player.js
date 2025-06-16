/*Player Class constructor.
Some values hardcoded since a) there's not much reason to have player input for those values and b) worst case scenario can load your previous save or alter score accordingly.
Functions were made here but were mostly for early testing purposes.

/*
@param {String} name = Discord Username
@param {String} realName = Player's real name
@param {Int} score = Player's score
@param {Map} scoreHistory = A map that details all score changes to a player. Used to double check that you haven't made a mistake somewhere. Mostly for console usage with /print.
@param {Int} scoreHistoryKey = The key to use for scoreHistory, incases by itself with the /score add/subtract commands.
@param {Int} kromer, a fun way to add a currency system to the game. Based off of Spamton's dialogue from Deltarune Ch. 2
@param {Map} itemInventory, a way to add items to the game. This is mostly used to keep track of items that the game host creates and not actual implementation of said items.
@param {Int} maxInvSize, a way to have a limit to the size of the player's inventory. Default is 4.
@param {Arr} relicInventory, a way to add relics to the game. Also mostly used to keep track of relics created by the game host, and not actual implementation of said relics.
@param {Snowflake} discordID, stores Discord ID
@param {String} nickname, a player's nickname.
*/


class Player {
    constructor (name, realName, score, scoreHistory, scoreHistoryKey, kromer, itemInventory, maxInvSize, relicInventory, discID, nickname){
        this.name = name;
        this.realName = realName;
        this.score = score;
        this.scoreHistory = scoreHistory;
        this.scoreHistoryKey = scoreHistoryKey;
        this.kromer = 0;
        this.itemInventory = itemInventory;
        this.maxInvSize = maxInvSize;
        this.relicInventory = relicInventory;
        this.discID = discID;
        this.nickname = nickname;
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