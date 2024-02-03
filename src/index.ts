import { Client, GatewayIntentBits, GuildMember, VoiceState } from "discord.js";
import { commands } from "./commands/commands";

import { shutdown } from "./commands/shutdown/shutdown.command";
import { about } from "./commands/about/about.command";
import { help } from "./commands/help/help.command";
import { Configuration } from "./configuration";
import { getResource, handleEmbedError, log } from "./utils/utils";
import { WhaproClass } from "./whapro";

const whapro = new WhaproClass();

const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates
]});

client.on("ready", () => {
	log(getResource("bot_ready"));
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand() || interaction.user.bot) return;
	const commandName: string = interaction.commandName;
	log(getResource("system_on_command", commandName, interaction?.user?.username + " (" + interaction?.user?.id + ")", interaction?.guild ? interaction?.guild.name + " (" + interaction?.guild?.id + ")" : "none"))
	if (commandName === "help") {
		help.execute(interaction);
		return;
	} 
	if (commandName === "about") {
		about.execute(interaction);
		return;
	} 
	
	if (commandName === "shutdown") {
		shutdown.execute(interaction);
		return;
	} 

	if (!interaction?.guild) {
		handleEmbedError(interaction, getResource("user_not_server"));
		return;
	}
	const guild = interaction.guild;
	const guildId = guild.id;
	const voice = (interaction.member as GuildMember)?.voice?.channel;
	const controller = whapro.getController(guildId);

	commands.find((c) => c.data.name === commandName)?.execute(interaction, controller, guild, voice);
});

client.on("voiceStateUpdate", (oldState, newState) => {
	const botClientId: string = Configuration.getClientId();
	const botChannelId = whapro.getController(oldState.guild.id).getConnection()?.joinConfig?.channelId;
	const isAlone = (s?: VoiceState) => {
		const state = s;
		if (!state) return;
		const guild = state?.guild;
		const count = state?.channel?.members?.size; // Check the channel and count member, channel includes bot
		if (count === 1) whapro.getController(guild.id).startAloneTimeout(); // If bot is alone (since channel includes bot, 1 is bot only), start timeout
		else whapro.getController(guild.id).stopAloneTimeout(); // If bot is not alone, stop timeout
	};

	if (oldState?.member?.id === botClientId) {
		// Bot moving
		if (!newState?.channel) {
			// Executes when bot is disconnected from channel
			const guild = oldState.guild;
			whapro.getController(guild.id).deleteConnection();
			return;
		}
		if (oldState?.channel?.id !== newState?.channel?.id && newState?.channel?.id) {
			// Executes when bot is moved from a channel to another
			const guild = newState.guild;
			whapro.getController(guild.id).newConnection(guild, newState?.channel?.id);
			isAlone(newState); // The new channel is selected and checked for activity
		}
	} else {
		// User moving
		if (oldState?.channel?.id !== botChannelId && newState?.channel?.id !== botChannelId) return; 
		// Stops if user move doesn't interest bot channel
		// If user move does interest one of the bot channel, the channel is selected and checked for activity
		isAlone(oldState?.channel?.id === botChannelId ? oldState : newState?.channel?.id === botChannelId ? newState : undefined);
	}	
});

client.login(Configuration.getToken());
