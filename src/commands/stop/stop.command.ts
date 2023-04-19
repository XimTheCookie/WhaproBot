import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";

export const stop = 
{
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Clear queue and stop playing!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply("Bot is not in a voice channel!");
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply("You must be in the same voice channel as bot to use that command!");
			return;
		}
		controller.deleteConnection();
		await interaction.reply("Disconnected!");
	}
}