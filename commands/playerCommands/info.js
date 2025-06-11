const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');


// A command to get a player's information (Name, Score, Discord Profile Picture, current placement)


// Returns a profile based on user's real name, otherwise returns null
function getProfileByName(value, mapToSearch){
    var lowercaseValue = value.toLowerCase(); 
    var valuesArray = Array.from(mapToSearch.values()); 
    for (let i = 0; i < valuesArray.length; i++){

        if (valuesArray[i].realName.toLowerCase() === lowercaseValue){
            return valuesArray[i];
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
                .setAuthor({ name: interaction.user.globalName, iconURL: interaction.user.displayAvatarURL(), url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields(
                    { name: 'Score', value: playerInput.score.toString()},
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
                //.setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Score', value: inputPlayer.score.toString()},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp();

            // Creates Item Fields for each player Item
            for (let i = 0; i < inputPlayer.maxInvSize; i++){
                itemText = inputPlayer.itemInventory[i] ?? "";
                playerEmbed.addFields({ name: `Slot ${i+1}`, value: `${itemText}`, inline: true })
                 if ((i+1) % 2 == 0){
                 playerEmbed.addFields({name: "\t", value: "\t"})   
                }
            }

            //Creates a Relic field, this time uses a newline for each relic instead of giving it its own slot.
            var relicText = "";
            for (let i = 0; i < inputPlayer.relicInventory.length; i++){
                relicText += inputPlayer.relicInventory[i];
                if (i != inputPlayer.relicInventory.length){
                    relicText += "\n";
                }    
            }
            playerEmbed.addFields({name: "Relics", value: relicText})

            await interaction.reply({ embeds: [playerEmbed] });
        }

        // Searches by real name, returns requested player's info.
        else if (inputName !== null && getProfileByName(inputName, pList.playerList) !== null) {
            var namedUser = getProfileByName(inputName, pList.playerList);
            console.log(namedUser)
            var discUser = await interaction.client.users.fetch(namedUser.discID);
            console.log("test2");
            console.log(discUser);
            var playerEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(namedUser.realName)
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Some name', iconURL: discUser.displayAvatarURL(), url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Score', value: namedUser.score.toString()},
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