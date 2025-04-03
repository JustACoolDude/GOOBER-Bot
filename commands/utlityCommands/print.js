const { SlashCommandBuilder } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');
const { generateDependencyReport } = require('@discordjs/voice');

// Debugging/Manual Score Check command. If you want to make sure all player data looks correct.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('print')
		.setDescription('Gamemaster Command. Prints all info of all players to console.'),
	async execute(interaction) {
        
		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }
		
		console.log(pList.playerList);
		//console.log(generateDependencyReport());
		await interaction.reply('Printing info to console!');
	},
};