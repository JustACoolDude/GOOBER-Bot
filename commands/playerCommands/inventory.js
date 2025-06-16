const { SlashCommandBuilder } = require('discord.js');
const {Player} = require('../../utilityFiles/player.js');
const fs = require('fs');
const pList = require('../../utilityFiles/playerList.js');
const {gameHostID} = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Alters Inventory')
        //Subcommand Group items, has commands that affect the items IN the inventory
        .addSubcommandGroup((subcommandGroup =>
            subcommandGroup
                .setName('items')
                .setDescription('Things to add to inv')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription("Add item to inventory")
                        .addUserOption(option =>
                            option.setName('user')
                            .setDescription('Ping a User')
                            .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName('item')
                            .setDescription('Add what item?')
                            .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option.setName("relic")
                            .setDescription("Is this a relic?")
                        )
                )
                
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription("Remove item from inventory")
                        .addUserOption(option =>
                            option.setName('user')
                            .setDescription('Ping a User')
                            .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName('item')
                            .setDescription('Remove what item?')
                            .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option.setName("relic")
                            .setDescription("Is this a relic?")
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('clear')
                        .setDescription('Clear a player\'s inventory')
                        .addUserOption(option =>
                            option.setName('user')
                            .setDescription('Ping a User')
                            .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option.setName("relic")
                            .setDescription("Is this a relic?")
                        )
                )
        ))
        // Subcommand group that alters the space of the inventory
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('space')
                .setDescription('Alters inventory space')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription("Increase inventory size")
                        .addUserOption(option =>
                            option.setName('user')
                            .setDescription('Ping a User')
                            .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option.setName('size')
                            .setDescription('Change size by how much?')
                            .setRequired(true)
                            .setMinValue(0)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription("Decrease inventory size")
                        .addUserOption(option =>
                            option.setName('user')
                            .setDescription('Ping a User')
                            .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option.setName('size')
                            .setDescription('Change size by how much?')
                            .setRequired(true)
                            .setMinValue(0)
                        )
                )
        ),

    async execute(interaction) {
        
        //Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID) {
            return await interaction.reply('You do not have perms for this command!');
        }
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const inputUser = interaction.options.getUser('user') ?? null;
        const inputItem = interaction.options.getString('item') ?? null;
        const inputSize = interaction.options.getInteger('size') ?? null;
        const isRelic = interaction.options.getBoolean('relic') ?? false;
 
        if (inputUser !== null && pList.playerList.has(inputUser.id.toString())) {
            var playerInput = pList.playerList.get(inputUser.id.toString());
            
            if (interaction.options.getSubcommand() === 'add') {
                if (subcommandGroup === 'items'){
                    if (playerInput.itemInventory.length + 1 > playerInput.maxInvSize && !isRelic){
                        return await interaction.reply('Item not added! Not enough Inventory Space!')
                    }
    
                    if (isRelic){
                        playerInput.relicInventory[playerInput.relicInventory.length] = inputItem;
                        return await interaction.reply('Relic added!');
                    }
                    else{ 
                        playerInput.itemInventory[playerInput.itemInventory.length] = inputItem;
                        return await interaction.reply("Item added!");
                    }
                }
                
                if (subcommandGroup === 'space'){
                    playerInput.maxInvSize += inputSize;
                    await interaction.reply('Inventory size increased!')
                }
                
            }

            else if (interaction.options.getSubcommand() === 'remove') {
                if (interaction.options.getSubcommandGroup() === 'items'){
                    parseInputItem = inputItem.toLowerCase(); 

                if (isRelic){
                    const parseInv = playerInput.relicInventory;
                    for (var element of parseInv){
                        element = element.toLowerCase();
                    }

                    var i = parseInv.indexOf(parseInputItem);
                    if (i > 0){
                        playerInput.relicInventory.splice(i,1);
                        return await interaction.reply('Relic removed!')
                    }
                }

                else {
                    const parseInv = playerInput.itemInventory;
                    for (var element of parseInv){
                        element = element.toLowerCase();
                    }

                    var i = parseInv.indexOf(parseInputItem);
                    if (i >= 0){
                        playerInput.itemInventory.splice(i,1);
                        return await interaction.reply('Item removed!')
                    }
                }

                await interaction.reply('Item not found!');
                }

                if (interaction.options.getSubcommandGroup() === 'space'){
                    if (playerInput.maxInvSize - inputSize < 0){
                        return await interaction.reply(`Can't set inventory size to a negative number!`)
                    }

                    playerInput.maxInvSize -= inputSize;
                    await interaction.reply('Inventory size reduced!')
                }
                
            }

            else if (interaction.options.getSubcommand() === 'clear' && subcommandGroup === 'items'){
                if (isRelic){
                    playerInput.relicInventory = new Map();
                }
                else {
                    playerInput.itemInventory = new Map();   
                }
                await interaction.reply('Inventory cleared!');
            }
        }
        
        else {
            await interaction.reply('Player not found!');
        }
    },
};