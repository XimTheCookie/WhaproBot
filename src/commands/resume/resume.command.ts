import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const resume = 
{
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resumes the player."),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("user_not_same_voice"));
			return;
		}
		if (!controller.playerStatus(AudioPlayerStatus.Paused)) {
			await interaction.reply(getResource("player_not_paused"));
			return;
		}
		controller.resumePlayer();
		await interaction.reply(getResource("player_resume"));
		return;
	}
}