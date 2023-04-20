import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { commands } from "./commands/commands";

import { help } from "./commands/help/help.command";
import { Configuration } from "./configuration";
import { handleReply } from "./utils/utils";
import { WhaproClass } from "./whapro";

const whapro = new WhaproClass();

const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates
]});

client.on("ready", () => {
	console.log("WhaproBot is now ready.");
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand() || interaction.user.bot) return;
	const commandName: string = interaction.commandName;
	console.log("Command received: " + commandName);
	if (!interaction?.guild) {
		if (commandName === "help") {
			help.execute(interaction);
			return;
		}
		handleReply(interaction, "user_not_server");
		return;
	}
	const guild = interaction.guild;
	const guildId = guild.id;
	const voice = (interaction.member as GuildMember)?.voice?.channel;
	const controller = whapro.getController(guildId);

	commands.find((c) => c.data.name === commandName)?.execute(interaction, controller, guild, voice);
});

client.on("voiceStateUpdate", (oldState, newState) => {
	if (!oldState?.channel && newState?.channel) return;
	
	

	if (oldState?.member?.id === Configuration.getClientId() && !newState?.channel) {
		const guild = oldState.guild;
		whapro.getController(guild.id).deleteConnection();
		return;
	}

	if (newState?.member?.id !== Configuration.getClientId()) return;
	if (oldState?.channel?.id !== newState?.channel?.id && newState?.channel?.id) {
		const guild = newState.guild;
		whapro.getController(guild.id).newConnection(guild, newState?.channel?.id)
	}
	
	
});

client.login(Configuration.getToken());