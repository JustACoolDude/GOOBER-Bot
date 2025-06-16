const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');
const _ = require('lodash');
// Uses the sort algorithm from Lodash to sort the map into sorted scores.

// Scoreboard shows an ordered list of all current players of their score, from highest to lowest.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('See how you\'re doing!'),
	async execute(interaction) {

        const scoresToSort = new Map();

        for (const [key,value] of pList.playerList.entries()){
            var playerInput = value;
            scoresToSort.set(playerInput.realName, playerInput.score);
        }

        var sortedScores = new Map(_.sortBy(Array.from(scoresToSort), [(entry) => entry[1]]).reverse());
        
        var scoresEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Scoreboard')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'G.O.O.N.E.R', iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.js.org' })
            .setDescription('How well are you doing?')
            //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
            //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp();
            //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
              
        var counter = 1;
        
        // Loops through sorted scores
        for (const [key, mapValue] of sortedScores.entries()){
            // Uses counter to display who's first in BOLD.    
            if (counter == 1) {
                scoresEmbed.addFields({ name: `**${counter}. ${key}: **`, value: `**${mapValue} Goonery Points**`}) 
            }    
            else if (counter < sortedScores.size + 1) {
                scoresEmbed.addFields({ name: `${counter}. ${key}: `, value: `**${mapValue}** Goonery Points`})
            }
              counter++;
         }

        
        
        await interaction.reply({ embeds: [scoresEmbed] });
	},
};