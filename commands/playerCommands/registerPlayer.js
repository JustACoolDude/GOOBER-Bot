const { SlashCommandBuilder } = require('discord.js');
const {Player} = require('../../utilityFiles/player.js');
const pList = require('../../utilityFiles/playerList.js');

// Registration, the first thing a player should do in a new game.
// Allows the game host to keep track of who's playing. You can only register once per game.
// Can allow re-registration from /newgame or /remove <player>

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
            var createPlayer = new Player(interaction.user.username, nameString, 0,0,0);
            
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