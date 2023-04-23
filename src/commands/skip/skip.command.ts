import { AudioPlayerStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply, handleReplyEmbed } from "../../utils/utils";

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
			if (!controller.canUseDJCommands(member) && controller.nowPlaying()?.userId !== member?.id) {
				handleReply(interaction, getResource("user_not_perm"), true);
				return;
			}
		}
		

		if (controller.playerStatus(AudioPlayerStatus.Playing) || controller.playerStatus(AudioPlayerStatus.Paused)) {
			const trackSkipEmbed = new EmbedBuilder();

			if (force) {
				controller.nextAudioResource();
				const track = controller.nowPlaying();
				trackSkipEmbed.setAuthor({name: getResource("track_skip_title_force")});
				trackSkipEmbed.setTitle(getResource("track_skip"));
				if (track) {
					trackSkipEmbed.setDescription(getResource("track_current_short", track.name));
					trackSkipEmbed.setThumbnail(track?.thumbnailUrl);
				}
				handleReplyEmbed(interaction, trackSkipEmbed);
				return;
			}
			
			let requiredVotes: number = Math.floor((voice.members.size - 1) / 2);
			if (requiredVotes < 1) requiredVotes = 1;

			const result = controller.addSkipVote(interaction.user.id, requiredVotes);

			if (typeof result === "number") {
				trackSkipEmbed.setAuthor({name: getResource("track_skip_title_vote")});
				trackSkipEmbed.setTitle("track_skip_votes");
				trackSkipEmbed.addFields([
					{
						name: getResource("track_skip_votes_current"),
						value: result?.toString()
					},
					{
						name: getResource("track_skip_votes_required"),
						value: requiredVotes?.toString()
					}
				])
				handleReplyEmbed(interaction, trackSkipEmbed);
				return;
			} 

			if (result) {
				trackSkipEmbed.setAuthor({name: getResource("track_skip_title")});
				const track = controller.nowPlaying();
				trackSkipEmbed.setTitle(getResource("track_skip"));
				if (track) {
					trackSkipEmbed.setDescription(getResource("track_current_short", track.name));
					trackSkipEmbed.setThumbnail(track?.thumbnailUrl);
				}
				handleReplyEmbed(interaction, trackSkipEmbed);
				return;
			}
			handleReply(interaction, getResource("track_skip_not_valid"));
			return;
		} 
		handleReply(interaction, getResource("track_skip_none"));
	}
}