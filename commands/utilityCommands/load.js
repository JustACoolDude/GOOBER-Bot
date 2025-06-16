const { SlashCommandBuilder } = require('discord.js');
const {gameHostID} = require('../../config.json');
const {Player} = require('../../utilityFiles/player.js');
const pList = require('../../utilityFiles/playerList.js');
var fs = require('fs');

// Loads information from the latest save to players.txt
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
// Currently WIP

module.exports = {
	data: new SlashCommandBuilder()
		.setName('load')
		.setDescription('Gamemaster command. Loads the game from a saved state'),
	async execute(interaction) {

		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID){
            return await interaction.reply('You do not have perms for this command!');
        }
		
		var dataFromSave = fs.readFileSync('players.txt', 'utf8', function (err, data){}).toString();
	
		if (dataFromSave == "") {
			return await interaction.reply('No save data found!');
		}

		console.log(dataFromSave.slice(-1));
		console.log(dataFromSave.substring(1, dataFromSave.length - 1));
		await interaction.reply('Loaded most recent save!');
	},
};