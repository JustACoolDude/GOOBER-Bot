const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const {gameHostID} = require('../../config.json');

// Disconnects the bot if it's in a voice channel. 
// If the bot is alone in a voice channel, it will automatically disconnect in 15 seconds (unless another user joins before then). Seen in index.js.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Gamemaster Command. Leaves voice channels if it\'s in one.'),
	async execute(interaction) {
        
		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }

        const connection = getVoiceConnection(interaction.guild.id) ?? null;

        if (connection !== null) {
            connection.destroy();
            await interaction.reply('Left the call!');
        }

        else {
            await interaction.reply('Not in a channel right now!');
        }
	},
};