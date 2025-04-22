const { SlashCommandBuilder } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');

// Game Host command in case a player messes up registration. User error moment.
// Deletes the player from the player list, allowing them to re-register and not having to restart the game.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Gamemaster Command. Removes a player\'s information.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Ping a User')
            .setRequired(true)
        ),

	async execute(interaction) {
        
		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }
		
        const inputUser = interaction.options.getUser('user') ?? null;

		if (pList.playerList.has(inputUser.id)) {
            pList.playerList.delete(inputUser.id);
            return await interaction.reply("Player Deleted!")
        }
		await interaction.reply('Player Not Found!');
	},
};