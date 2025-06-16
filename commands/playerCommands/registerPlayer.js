const { SlashCommandBuilder } = require('discord.js');
const {Player} = require('../../utilityFiles/player.js');
const pList = require('../../utilityFiles/playerList.js');

// Registration, the first thing a player should do in a new game.
// Allows the game host to keep track of who's playing. You can only register once per game.
// Can allow re-registration from /newgame or /remove <player>
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers you as a new player')
        .addStringOption(option =>
            option.setName('name')
            .setDescription("Please input your real name.")
            .setRequired(true)
        ),
	async execute(interaction) {
		
        // Prevents double listing

        if (!pList.playerList.has(interaction.user.id) && interaction.options.getString('name') !== null){
            // Instantiates new Player class
            
            var nameString = interaction.options.getString('name');
            // name, realName, score, scoreHistory, scoreHistoryKey, kromer, itemInventory, maxInvSize, relicInventory, discID. nickname
            var createPlayer = new Player(interaction.user.username, nameString, 0, new Map(), 0, 0, new Array(), 4, new Array(), interaction.user.id, "");
            
            // Creates a new addition to the map based on player's Discord ID, ensuring each entry is unique.
            pList.playerList.set(interaction.user.id, createPlayer);
            
            // Adds to player Index for counting purposes
            pList.playerIndex++;
            
            await interaction.reply('Registration Complete!');
            }
        
            
        // in case of double register
        else if (pList.playerList.has(interaction.user.id)){
            await interaction.reply('You\'re already registered!');
        }

        // if all else fails
        else {
            await interaction.reply('Something went wrong! Please try again!');
        }

	},
};