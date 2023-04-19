import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const pause = 
{
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the player!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("user_not_same_voice"));
			return;
		}
		if (controller.playerStatus(AudioPlayerStatus.Paused)) {
			await interaction.reply(getResource("player_already_paused"));
			return;
		}
		controller.pausePlayer();
		await interaction.reply(getResource("player_pause"));
		return;
	}
}