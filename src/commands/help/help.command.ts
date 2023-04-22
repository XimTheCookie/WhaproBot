import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";
import { commands } from "../commands";

export const help = 
{
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(getResource("command_help_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller?: MusicController, guild?: Guild, voice?: VoiceBasedChannel | null) {
		let print: string = "";
		print = print + "```bf\n";
		const commandList: string[] = ["help"];
		commands.forEach((c) => commandList.push(c?.data?.name));
		commandList.forEach(c => {
			print = print + getResource(`command_${c}`) + "\n";
		});
		print = print + "```";
		handleReply(interaction, print, true);
	}
}