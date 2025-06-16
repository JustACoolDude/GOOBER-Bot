const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, MessageFlags, ComponentType } = require('discord.js');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { gameHostID } = require('../../config.json');
const pList = require('../../utilityFiles/playerList.js');
const wait = require('node:timers/promises').setTimeout;

// Creates the buzzer for the quiz show. 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buzzer')
		.setDescription('Gamemaster Command. Creates a new buzzer.'),
	async execute(interaction) {
        
		//Perms Checker based on config setting
        if (interaction.user.id.toString() !== gameHostID){
            return await interaction.reply('You do not have perms for this command!');
        }

		//Button builders. They all do the same thing, act as a buzzer.
		const buzzIn = new ButtonBuilder()
			.setCustomId('buzzin')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);
		
		const buzzIn2 = new ButtonBuilder()
			.setCustomId('buzzin2')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);

		const buzzIn3 = new ButtonBuilder()
			.setCustomId('buzzin3')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);
		
		const buzzIn4 = new ButtonBuilder()
			.setCustomId('buzzin4')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);
		
		const buzzIn5 = new ButtonBuilder()
			.setCustomId('buzzin5')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);
	
		const buzzIn6 = new ButtonBuilder()
			.setCustomId('buzzin6')
			.setLabel('BUZZ ME')
			.setStyle(ButtonStyle.Danger);


		//Action row builders. Makes a 3x2 grid of buzzers for easier buzzing and having to worry less about accuracy, especially on mobile. 
		const row = new ActionRowBuilder()
			.addComponents(buzzIn)
			.addComponents(buzzIn2)
			.addComponents(buzzIn3);

		const row2 = new ActionRowBuilder()
			.addComponents(buzzIn4)
			.addComponents(buzzIn5)
			.addComponents(buzzIn6);

		//The message that sends out the buzzer.
		const response = await interaction.reply({
			content: 'Press the buzzer when you think you know the answer!',
			components:[row,row2],
			withResponse: true,
		});
		
		var soundActive = true;
		// Buzzer sound effect by https://pixabay.com/users/floraphonic-38928062/
		function buzzerSound(){
			try{
				if (getVoiceConnection(interaction.guild.id) == null){
					return;
				}

				if (!soundActive){
					return;
				}
				
				const connection = getVoiceConnection(interaction.guild.id);
				//const filepath = '../../utilityFiles/goon.mp3';
				const audioPlayer = createAudioPlayer();
				const audioResource = createAudioResource(createReadStream(join(__dirname, 'audioFiles', 'buzzer.mp3')), {inlineVolume: true});

				audioResource.volume.setVolume(1.0);
				audioPlayer.play(audioResource);
				connection.subscribe(audioPlayer);
				
				/* Debugging
				audioPlayer.on(AudioPlayerStatus.Playing, () => {
					console.log('The audio player has started playing!');
				});
				*/
			} 
			catch(error){
				console.log("Uh oh.");
				console.log(error);
			}	
		}
		
		const buttonCollector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });
		var textToSend = "";
		var playerArray = new Set();
		var timePassed = false;
		
		buttonCollector.on('collect', async i => {
			// Checks if person who buzzed is actually registered
			if (!pList.playerList.has(i.user.id)){
				await i.reply({ content: 'You\'re not registered!', flags: MessageFlags.Ephemeral });
			}

			//Checks if Player has buzzed in already.
			else if (playerArray.has(i.user.id)){
				buzzerSound();
				await i.reply({ content: 'You\'ve already buzzed!', flags: MessageFlags.Ephemeral });
				await wait (3_000);
				await i.deleteReply();
			}
			// Checks if 3 seconds have passed. There is a delay before announcing the results, which prevents the buzzer from being moved due to the bot's
			// text. Otherwise, people might eventually have to scroll up for the button while they're all trying to hit it at the same time. 
			else if (timePassed){
				buzzerSound();
				playerArray.add(i.user.id);
				textToSend += `${i.user} has buzzed in!\n`
				await i.channel.send(textToSend);
				textToSend = "";
			}

			// After 3 seconds, bypasses the delay for anyone else who wants to buzz in after. Uses the timePassed variable as a timer for the previous else if block.
			else {
				buzzerSound();
				playerArray.add(i.user.id);
				textToSend += `${i.user} has buzzed in!\n`
				await i.deferReply({ flags: MessageFlags.Ephemeral });
				await wait(3_000);
				
				if (!timePassed){
					i.channel.send(textToSend);
					textToSend = "";
					timePassed = true;
				}
				
				await i.deleteReply();
			}

			await wait (3_000);
			soundActive = false;

		});

		// Sets a reaction for the game host to use to delete the buzzer earlier if needed. Prevents later confusion on which button to press.
		response.resource.message.react('❌');

		const emoteCollectorFilter = (reaction, user) => {
			return reaction.emoji.name === '❌' && user.id == gameHostID;
		};

		const emoteCollector = response.resource.message.createReactionCollector({ filter: emoteCollectorFilter, time: 300_000});

		// Makes sure to destroy everything.
		emoteCollector.on('collect', (reaction, user) => {
			buttonCollector.stop();
			emoteCollector.stop();
			response.resource.message.delete();
		});
		
	
	},
};