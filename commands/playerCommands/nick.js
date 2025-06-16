const { SlashCommandBuilder } = require('discord.js');
const pList = require('../../utilityFiles/playerList.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Create a nickname for yourself')
        .addStringOption(option =>
            option.setName('nickname')
            .setDescription("Please input your desired nickname.")
            .setRequired(true)
        ),
    async execute(interaction) {
        
        // Checks to see if player is registered in playerList
        if (pList.playerList.has(interaction.user.id)){
            var nickString = interaction.options.getString('nickname');
            pList.playerList.get(interaction.user.id).nickname = nickString;
            await interaction.reply("Nickname Changed!");
        }

        // If player isn't registered
        else {
            await interaction.reply('You aren\'t registered!');
        }

    },
};