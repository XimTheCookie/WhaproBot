import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import { commands } from "./commands/commands";

import { Configuration } from "./configuration";
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
		interaction.reply("Not a server!");
		return;
	}
	const guild = interaction.guild;
	const guildId = guild.id;
	const voice = (interaction.member as GuildMember)?.voice?.channel;
	const controller = whapro.getController(guildId);
	
	commands.find((c) => c.data.name === commandName)?.execute(interaction, controller, guild, voice);
});


client.login(Configuration.getToken());

