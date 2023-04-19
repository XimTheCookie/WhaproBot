import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const help = 
{
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("View a list of commands!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		let print: string = "";
		print = print + "```ruby\n";
		const commandList = [
			"help",
			"join",
			"play",
			"skip",
			"queue"
		];
		commandList.forEach(c => {
			print = print + getResource(`command_${c}`) + "\n";
		});
		print = print + "```";
		await interaction.reply(print);
	}
}