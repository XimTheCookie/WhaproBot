import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const skip = 
{
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription(getResource("command_skip_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"));
			return;
		}
		if (controller.playerStatus(AudioPlayerStatus.Playing) || controller.playerStatus(AudioPlayerStatus.Paused)) {
			controller.nextAudioResource();
			const track = controller.nowPlaying();
			if(track) {
				handleReply(interaction, `${getResource("track_skip")}\n\n${getResource("track_current_short", track.name)}`);
				return;
			} 
			handleReply(interaction, getResource("track_skip"));
			return;
		} 
		handleReply(interaction, getResource("track_skip_none"));
	}
}