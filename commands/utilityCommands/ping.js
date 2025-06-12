const { SlashCommandBuilder } = require('discord.js');

// I wanna get back into ping pong sometime

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};