import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const remove = 
{
	data: new SlashCommandBuilder()
		.setName("remove")
		.setDescription(getResource("command_remove_dsc"))
		.addIntegerOption(option => 
			option.setName("index")
				.setDescription(getResource("command_remove_dsc_option_index"))
				.setRequired(true) 
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
		const index = interaction.options.getInteger("index");
		const removedTrack = index ? controller.remove(index - 1) : undefined;
		
		if (removedTrack) handleReplyEmbed(interaction, 
			new EmbedBuilder()
				.setAuthor({name: getResource("track_removed")})
				.setTitle(removedTrack?.name)
				.setURL(removedTrack?.url)
				.setThumbnail(removedTrack?.thumbnailUrl)
			);
		else handleEmbedError(interaction, getResource("track_not_removed", index?.toString()));
	}
}