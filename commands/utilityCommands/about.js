const { SlashCommandBuilder } = require('discord.js');

// Details about the bot.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Learn about this bot!'),
	async execute(interaction) {
		
        var text = `# **__G.O.O.B.E.R v1.0__**
                    \n**G**reat **O**bserver **O**rganizes **B**rilliant **E**ntertaining **R**esults
                    \nA bot meant to help with hosting trivia shows.
                    \nCreated by JustACoolDude, 2025
                    \nMade in DiscordJS v14.18.0
					\nThanks a bunch to the folks at discord.js Guide!`;
		await interaction.reply(text);
	},
};