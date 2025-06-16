const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');
const { error } = require('console');

// Erases all data currently saved on the bot (while active) by restoring playerList to default values. Saves in other text files are not affected.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Gamemaster command. Starts a new game by erasing all player data.'),
	async execute(interaction) {
		
		if (interaction.user.id.toString() !== gameHostID){
            return await interaction.reply('You do not have perms for this command!');
        }
		
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm New Game')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);

		const response = await interaction.reply({
				content: 'Are you sure you want to start a new game?',
				components: [row],
				withResponse: true
		});

		// Makes sure that only the Game Host can press the button.
		const collectorFilter = i => i.user.id === gameHostID;
		try {
			const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 20_000 });
			if (confirmation.customId === 'confirm') {
				pList.playerList = new Map();
       			pList.playerIndex = 1;
				await confirmation.update({ content: `New Game Started!`, components: [] });
			} 
			
			else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Action cancelled', components: [] });
			}
		} catch {
			console.log(error);
			// Cheeky joke
			await interaction.editReply({ content: 'Confirmation not received. Assuming the user has died, aborting.', components: [] });
		}

	},
};