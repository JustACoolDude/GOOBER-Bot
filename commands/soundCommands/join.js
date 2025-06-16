const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const {gameHostID} = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Gamemaster Command. Prints all info of all players to console.')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Enter a voice Channel name")
            .setRequired(true)
        ),


	async execute(interaction) {
        
		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }

        const channelToJoin = interaction.options.getChannel('channel');
		
        if (channelToJoin.type !== 2 ) {
            return await interaction.reply("This is not a voice channel!");
        }

        const connection = joinVoiceChannel({
            channelId: channelToJoin.id,
            guildId: channelToJoin.guild.id,
            adapterCreator: channelToJoin.guild.voiceAdapterCreator,
        });

        return await interaction.reply('Joined voice channel!');
	},
};