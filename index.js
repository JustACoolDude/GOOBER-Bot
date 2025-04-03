const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, userMention, VoiceState } = require('discord.js');
const { getVoiceConnection} = require('@discordjs/voice');
const { token } = require('./config.json');
const wait = require('node:timers/promises').setTimeout;

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Checks if bot has been pinged. Sends a message to the channel where the ping originated to give some advice on how to get started.
client.on('messageCreate', msg =>{
	const botPing = userMention(client.user.id);
	if (msg.content.includes(botPing) && msg.author.id !== client.user.id){
		msg.channel.send(`Hi, I'm ${botPing}, use **/help** for more information!`)
	}
})

// voiceStatusUpdate listener. Checks if the bot is in a voice channel with at least one other user. If not, disconnects automatically in 15 seconds. 
var areThereOthers = true;

client.on('voiceStateUpdate', async (oldState, newState) => {

	if (newState.member.user.bot && areThereOthers == false){
		return;
	}

	try{
		const connection = getVoiceConnection(newState.member.guild.id) ?? null;

		// Checks if there's actually a voice connection, otherwise returns to break out of the block.
		if (connection == null){
			return;
		}
		
		var voiceID = connection.joinConfig.channelId;
		var memberCount = client.channels.cache.get(voiceID).members.size;
		
		if (memberCount > 1) {
			areThereOthers = true;
		}

		if (memberCount == 1) {
			areThereOthers = false;
			await wait(15_000);
			if (!areThereOthers) {
				connection.destroy();
			}
		}
		
	} catch(error) {
		// The only error that should happen is if the bot is disconnected before the auto-disconnect kicks in, either manually or /disconnect. (Connection already destroyed)
		// console.log(error);
	}

})

client.on(Events.InteractionCreate, async interaction => {
	
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);