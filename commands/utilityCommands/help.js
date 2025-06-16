const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const {gameHostID} = require('../../config.json');

// A rather lazy help command. Displays available commands to normal users, has an option to show admin commands to game host.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all available commands!')
            .addBooleanOption(option => 
                option.setName('admin')
                    .setDescription('See list of Admin Commands')
            ),
	    
        async execute(interaction) {
            console.log(interaction.client.user);
            var playerEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('List of commands!')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.js.org' })
            .setDescription('Find all usable commands here! All commands begin with a "/".')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'help', value: 'You\'ve just used this command!'},
                { name: 'register <real name>', value: "**USE THIS COMMAND FIRST!** Add in your real name (required) for ease of use later on."},
                { name: 'ping', value: "Pong!"},
                { name: 'info [ping/real name/leave blank]', value: "Either ping a user or type their real name to get info on them. Leave blank for your own info."},
                { name: 'scoreboard', value: "Get an ordered list of who's in the lead!"},
                { name: 'roll <integer/wof>', value: "Roll a dice or spin the Wheel of Fortune!"},
                { name: 'nickname', value: 'Give yourself a nickname!'},
                { name: 'about', value: "Learn about this bot!"},
            )
            //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp();
            //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            var adminEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('List of Admin Commands!')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.js.org' })
            .setDescription('You must be pretty cool to be able to see these!')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'score <add/subtract> <value> [optional comment]', value: 'Alters the score of a registered player!'},
                { name: 'remove <player>', value: "De-registers a player, allowing them to re-register."},
                { name: 'join <voice channel>', value: "Has the bot join the voice channel. Leaves automatically in 15 seconds when no one is there."},
                { name: 'disconnect', value: "Disconnects the bot if it's in a voice channel."},
                { name: 'newgame', value: "Deletes all currently loaded player information."},
                { name: 'save', value: "Saves all current player information to an external file."},
                { name: 'load', value: "Loads player information from a previously made save file."},
            )
            //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp();
            
            const isAdmin = interaction.options.getBoolean('admin') ?? null;

            if (isAdmin){
               if (interaction.user.id == gameHostID){
                return await interaction.reply({ embeds: [adminEmbed], flags: MessageFlags.Ephemeral});
               } 
               return await interaction.reply('You aren\'t the game host!');
            }
            
            return await interaction.reply({ embeds: [playerEmbed]});
       
      
	},
};