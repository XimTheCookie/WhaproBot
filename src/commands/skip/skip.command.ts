import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const skip = 
{
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription(getResource("command_skip_dsc"))
		.addBooleanOption(option => 
			option.setName("force")
				.setDescription(getResource("command_skip_dsc_option_force"))
				.setRequired(false) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}
		const force = !!interaction.options.getBoolean("force");

		if (force) {
			const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;
			if (!controller.canUseDJCommands(member)) {
				handleReply(interaction, getResource("user_not_perm"), true);
				return;
			}
		}
		

		if (controller.playerStatus(AudioPlayerStatus.Playing) || controller.playerStatus(AudioPlayerStatus.Paused)) {

			if (force) {
				controller.nextAudioResource();
				const track = controller.nowPlaying();
				if(track) handleReply(interaction, `${getResource("track_skip")}\n\n${getResource("track_current_short", track.name)}`);
				else handleReply(interaction, getResource("track_skip"));
				return;
			}
			
			let requiredVotes: number = Math.floor((voice.members.size - 1) / 2);
			if (requiredVotes < 1) requiredVotes = 1;

			const result = controller.addSkipVote(interaction.user.id, requiredVotes);

			if (typeof result === "number") {
				handleReply(interaction, getResource("track_skip_votes", result?.toString(), requiredVotes?.toString()));
				return;
			} 

			if (result) {
				const track = controller.nowPlaying();
				if (track) handleReply(interaction, `${getResource("track_skip")}\n\n${getResource("track_current_short", track.name)}`);
				else handleReply(interaction, getResource("track_skip"));
				return;
			}
			handleReply(interaction, getResource("track_skip_not_valid"));
			return;
		} 
		handleReply(interaction, getResource("track_skip_none"));
	}
}