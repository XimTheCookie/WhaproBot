import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const about = 
{
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription(getResource("command_about_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller?: MusicController, guild?: Guild, voice?: VoiceBasedChannel | null) {
		const aboutContent = `WhaproBot by Xim_ https://github.com/XimTheCookie/WhaproBot\n${getResource("custom_about")}`;
		handleReply(interaction, aboutContent, true);
	}
}