import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

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
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}
		if (!controller.nowPlaying()) {
			handleEmbedError(interaction, getResource("track_skip_none"));
			return;
		}
		const force = !!interaction.options.getBoolean("force");

		if (force) {
			const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;
			if (!controller.canUseDJCommands(member) && controller.nowPlaying()?.userId !== member?.id) {
				handleEmbedError(interaction, getResource("user_not_perm"));
				return;
			}
		}
		
		const trackSkipEmbed = new EmbedBuilder();

		if (force) {
			controller.nextAudioResource();
			const track = controller.nowPlaying();
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
			const track = controller.nowPlaying();
			trackSkipEmbed.setTitle(getResource("track_skip"));
			if (track) {
				trackSkipEmbed.setDescription(getResource("track_current_short", track.name));
				trackSkipEmbed.setThumbnail(track?.thumbnailUrl);
			}
			handleReplyEmbed(interaction, trackSkipEmbed);
			return;
		}
		handleEmbedError(interaction, getResource("track_skip_not_valid"), true);
	}
}