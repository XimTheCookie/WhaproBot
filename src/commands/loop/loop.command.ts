import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";

export const loop = 
{
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the queue!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply("Bot is not in a voice channel!");
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply("You must be in the same voice channel as bot to use that command!");
			return;
		}
		if (controller.loop()) await interaction.reply("Loop enabled!");
		else await interaction.reply("Loop disabled!");
	}
}