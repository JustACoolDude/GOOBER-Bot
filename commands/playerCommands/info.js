const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');


// A command to get a player's information (Name, Score, Discord Profile Picture, current placement)

// Searches the playerList for a specific value (in this case, names). Returns true if it finds the name, otherwise false.
function searchByValue(value, mapToSearch){
    var lowercaseValue = value.toLowerCase();
    var arrayMap = mapToSearch.entries();

    for (let i = 0; i < arrayMap; i++){
        if (arrayMap[i].name.toLowerCase() === lowercaseValue){
            return true;
        }
    }
    return false;
}

// Similar to searchByValue, but instead returns a Player Object from PlayerList.
function getProfileByName(value, mapToSearch){
    var lowercaseValue = value.toLowerCase();
    var arrayMap = mapToSearch.entries();

    for (let i = 0; i < arrayMap; i++){
        if (arrayMap[i].name.toLowerCase() === lowercaseValue){
            return arrayMap[i];
        }
    }
    return null;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Gets info on yourself or another player')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Optionally ping a user for their info')
        )
        .addStringOption(option =>
            option.setName('realname')
            .setDescription('or instead use a player\'s real name')
        ),
	async execute(interaction) {
		
        const inputUser = interaction.options.getUser('user') ?? null;
        const inputName = interaction.options.getString('realname') ?? null;

         // If user didn't input a different player's ping, give's back user's Player info.
        if (pList.playerList.has(interaction.user.id) && inputUser == null && inputName == null) {
            
            var playerInput = pList.playerList.get(interaction.user.id.toString());            
            var playerEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(playerInput.realName)
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Score', value: playerInput.score.toString()},
                    { name: 'Kromer', value: playerInput.kromer.toString()}
                    //{ name: '\u200B', value: '\u200B' },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            await interaction.reply({ embeds: [playerEmbed] });

            
        }
        
        // If user is looking for information on another player (including self).    
        else if (inputUser !== null && pList.playerList.has(inputUser.id.toString())) {
            var inputPlayer = pList.playerList.get(inputUser.id.toString());

            var playerEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(inputPlayer.realName)
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Score', value: inputPlayer.score.toString()},
                    { name: 'Kromer', value: inputPlayer.kromer.toString()}
                    //{ name: '\u200B', value: '\u200B' },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
            await interaction.reply({ embeds: [playerEmbed] });
        }

        // Searches by real name, returns requested player's info.
        else if (inputUser == null && inputName !== null && searchByValue(inputName,pList.playerList)) {
            
            var namedUser = getProfileByName(inputName, pList.playerList);
            var playerEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(namedUser.realName)
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Score', value: namedUser.score.toString()},
                    { name: 'Kromer', value: namedUser.kromer.toString()}
                    //{ name: '\u200B', value: '\u200B' },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();
            await interaction.reply({ embeds: [playerEmbed]});
        }

        // If user is not registered/incorrect input
        else {
            await interaction.reply('Player not found!');
        }

	},
};