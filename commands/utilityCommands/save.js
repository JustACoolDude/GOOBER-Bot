const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');
// Manual Save function for when if the bot suddenly crashes. Game can be resumed by using the /load command, which loads from the latest players.txt file.
// Score commands do an autosave when used.
// Currently WIP

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save')
		.setDescription('Gamemaster command. Saves all current player information'),
	async execute(interaction) {
        
		if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }

        function savePlayers(){
            
            function mapToJson(map) {
                const obj = {};
                for (const [key, value] of map) {
                    obj[key] = value instanceof Map ? mapToJson(value) : value;
                }
                return JSON.stringify(obj);
            }
            

            // Hardcoded since I'm the only one using the bot. Can be altered pretty easily by adding parameters to savePlayers()
            // Talking to myself like this is a little weird, isn't it?
            // Perhaps one shouldn't code at 1:30 in the morning.
            // - Every CS Major's thought, not realizing it's actually 4 AM.
            // Good thing I'm not a CS major (it's still 1:30)
            const json = mapToJson(pList.playerList);
            fs.writeFile("players.txt", json, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            
        }
        
        savePlayers();
        
        await interaction.reply('Save Complete!');
	},
};

