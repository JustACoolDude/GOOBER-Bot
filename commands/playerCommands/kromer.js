const { SlashCommandBuilder } = require('discord.js');
const {Player} = require('../../utilityFiles/player.js');
const fs = require('fs');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kromer')
        .setDescription('Alters kromer')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add to Kromer")
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('kromer')
                    .setDescription('Change kromer by how much?')
                    .setRequired(true)
                    .setMinValue(0)
                )
        )
        
        .addSubcommand(subcommand =>
            subcommand
                .setName('subtract')
                .setDescription("Deduct from Kromer")
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('kromer')
                    .setDescription('Change Kromer by how much?')
                    .setRequired(true)
                    .setMinValue(0)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set kromer to a number')
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('kromer')
                    .setDescription('Change kromer to what value?')
                    .setRequired(true)
                )
        ),

    async execute(interaction) {
        
        //Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }

        const inputUser = interaction.options.getUser('user') ?? null;
        const inputChange = interaction.options.getNumber('kromer') ?? null;
 
        if (inputUser !== null && inputChange !== null && pList.playerList.has(inputUser.id.toString())) {
            var playerInput = pList.playerList.get(inputUser.id.toString());
            
            if (interaction.options.getSubcommand() === 'add') {
                playerInput.kromer += inputChange;              
                await interaction.reply('Kromer changed!');
            }

            else if (interaction.options.getSubcommand() === 'subtract') {
                playerInput.kromer -= inputChange; 
                await interaction.reply('Kromer changed!');
            }

            else if (interaction.options.getSubcommand() === 'set'){
                playerInput.kromer = inputChange;
                await interaction.reply('Kromer changed!');
            }
        
        }
        
        else {
            await interaction.reply('Player not found!');
        }
    },
};