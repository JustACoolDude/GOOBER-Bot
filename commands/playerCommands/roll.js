const { SlashCommandBuilder } = require('discord.js');

// Li'l RNG command, if needed for some reason.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Enter an integer value and roll a die!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('d')
                .setDescription('Roll a multi-sided dice!')
                .addIntegerOption(option =>
                    option.setName('integer')
                    .setDescription('number to roll (must be an integer!)')
                    .setRequired(true)
                )
        )
        // Fun little reference to the Wheel of Fortune from Balatro. Probably ever so slightly less random than the true WoF because of lack of seed.
        // Let's go gambling.
        .addSubcommand(subcommand =>
            subcommand
                .setName('wof')
                .setDescription('Wheel of Fortune! 1/4 Chance to Win!')
        ),


	async execute(interaction) {
        
        var outputResult = "";
        const inputInt = interaction.options.getInteger('integer');

        if (interaction.options.getSubcommand() === 'd') {
            var rollOutput = (Math.floor(Math.random() * inputInt + 1)).toString();
            outputResult = `You rolled a ${rollOutput}!`;
        }
        
        if (interaction.options.getSubcommand() === 'wof') {
            var wheelSpin = (Math.floor(Math.random() * 4));
            if (wheelSpin == 0) {
                outputResult = "Success!";
            }    
            else {
                outputResult = "Nope!";
            }
        }
		
        await interaction.reply(outputResult);
	},
};