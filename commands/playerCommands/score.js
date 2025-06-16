const { SlashCommandBuilder } = require('discord.js');
const {Player} = require('../../utilityFiles/player.js');
const fs = require('fs');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');

function savePlayers(){
            
            function mapToJson(map) {
                const obj = {};
                for (const [key, value] of map) {
                    obj[key] = value instanceof Map ? mapToJson(value) : value;
                }
                return JSON.stringify(obj);
            }

            const json = mapToJson(pList.playerList);
            fs.writeFile("players.txt", json, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            
        }


 //Score Commands to alter Score

 module.exports = {
	data: new SlashCommandBuilder()
		.setName('score')
		.setDescription('Alters Score')
        //Adds score to player, requires User, Change to Score (non-negative value), and option to comment
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add to Score")
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('points')
                    .setDescription('Change points by how much?')
                    .setRequired(true)
                    .setMinValue(0)
                )
                .addBooleanOption(option =>
                    option.setName('kromer')
                    .setDescription('Add Kromer?')
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('comment')
                    .setDescription('optional comment')
                )
        )
        
        //Subtracts score from player, requires User, Change to Score (non-negative value), and option to comment. 
        .addSubcommand(subcommand =>
            subcommand
                .setName('subtract')
                .setDescription("Deduct from Score")
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('points')
                    .setDescription('Change points by how much?')
                    .setRequired(true)
                    .setMinValue(0)
                )
                .addStringOption(option =>
                    option.setName('comment')
                    .setDescription('optional comment')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set score to a value')
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('Ping a User')
                    .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('points')
                    .setDescription('Change points to what value?')
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('comment')
                    .setDescription('optional comment')
                )
        ),

	async execute(interaction) {
		
        //Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }

        const inputUser = interaction.options.getUser('user') ?? null;
        const inputChange = interaction.options.getNumber('points') ?? null;
        const inputKromer = interaction.options.getBoolean('kromer');
        var comment = interaction.options.getString('comment') ?? null;

        if (comment == null){
            comment = "No Comment"
        }

        if (inputUser !== null && inputChange !== null && pList.playerList.has(inputUser.id.toString())) {
            var playerInput = pList.playerList.get(inputUser.id.toString());
            
            if (interaction.options.getSubcommand() === 'add') {
                playerInput.score += inputChange;
                playerInput.scoreHistory.set(playerInput.scoreHistoryKey.toString(), inputChange.toString() + " " + comment);
                playerInput.scoreHistoryKey += 1;

                if (inputKromer){
                    playerInput.kromer += (inputChange / 100);
                }
                
                await interaction.reply('Score changed!');
                savePlayers();
            }

            else if (interaction.options.getSubcommand() === 'subtract') {
                playerInput.score -= inputChange; 
                playerInput.scoreHistory.set(playerInput.scoreHistoryKey.toString(), "-" + inputChange.toString() + " " + comment);
                playerInput.scoreHistoryKey += 1;


                await interaction.reply('Score changed!');
                savePlayers();
            }

            else if (interaction.options.getSubcommand === 'set'){
                playerInput.score = inputChange; 
                playerInput.scoreHistory.set(playerInput.scoreHistoryKey.toString(), "-" + inputChange.toString() + " " + comment);
                playerInput.scoreHistoryKey += 1;


                await interaction.reply('Score changed!');
                savePlayers();
            }
        
        }
        
        else {
            await interaction.reply('Player not found!');
        }
	},
};