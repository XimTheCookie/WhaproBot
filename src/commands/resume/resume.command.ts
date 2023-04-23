import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply, handleReplyEmbed } from "../../utils/utils";

export const resume = 
{
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription(getResource("command_resume_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}
		if (!controller.playerStatus(AudioPlayerStatus.Paused)) {
			handleReply(interaction, getResource("player_not_paused"), true);
			return;
		}
		controller.resumePlayer();
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("player_resume")));
	}
}