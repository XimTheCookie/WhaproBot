import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const resume = 
{
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription(getResource("command_resume_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}
		if (!controller.playerStatus(AudioPlayerStatus.Paused)) {
			handleEmbedError(interaction, getResource("player_not_paused"));
			return;
		}
		controller.resumePlayer();
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("player_resume")));
	}
}