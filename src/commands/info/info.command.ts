import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const info = 
{
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription(getResource("command_info_dsc"))
		.addIntegerOption(option => 
			option.setName("index")
				.setDescription(getResource("command_info_dsc_option_index"))
				.setRequired(false) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		const index = interaction.options.getInteger("index");
		if (!index || index < 1) {
			const track = controller.nowPlaying();
			const nowPlayingEmbeds = new EmbedBuilder();
			nowPlayingEmbeds.setAuthor({name: getResource("track_info_title_current")});
			if (track) {
				nowPlayingEmbeds.setTitle(track?.name);
				nowPlayingEmbeds.setURL(track?.url);
				nowPlayingEmbeds.setThumbnail(track?.thumbnailUrl);
				nowPlayingEmbeds.setDescription(getResource("track_user", track?.userId));
			}
			else nowPlayingEmbeds.setDescription(getResource("track_current_none"));
			
			handleReplyEmbed(interaction, nowPlayingEmbeds);
			return;
		}
		
		if (index > controller.getQueue().length) {
			handleEmbedError(interaction, getResource("queue_info_no_index", index ? index.toString() : "0"));
			return;
		}

		const track = controller.getQueue()[index - 1];
		const infoEmbeds = new EmbedBuilder();
		infoEmbeds.setAuthor({name: getResource("track_info_title")});
		if (track) {
			infoEmbeds.setTitle(track?.name);
			infoEmbeds.setURL(track?.url);
			infoEmbeds.setThumbnail(track?.thumbnailUrl);
			infoEmbeds.setDescription(getResource("track_user", track?.userId));
		}
		else infoEmbeds.setDescription(getResource("queue_info_no_index"));

		handleReplyEmbed(interaction, infoEmbeds);
	}
}