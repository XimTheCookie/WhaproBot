import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { TrackType } from "../../models/enums/TrackType.enum";
import { MusicController } from "../../music.controller";
import { getResource, handleEditReplyEmbed, handleEmbedError, handleReply } from "../../utils/utils";

export const play = 
{
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription(getResource("command_play_dsc"))
		.addStringOption(option => 
			option.setName("query")
				.setDescription(getResource("command_play_dsc_option_query"))
				.setRequired(true) 
			)
		.addBooleanOption(option => 
			option.setName("next")
				.setDescription(getResource("command_play_dsc_option_next"))
				.setRequired(false) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		
		if (!voice) {
			handleEmbedError(interaction, getResource("user_not_voice"));
			return;
		}

		if (!voice.joinable && controller.getConnection()?.joinConfig?.channelId !== voice.id) {
			handleEmbedError(interaction, getResource("bot_cannot_join"));
			return;
		}
		
		const currentChannelId = controller.getConnection(guild, voice.id)?.joinConfig?.channelId;

		if (currentChannelId !== voice.id) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}

		const query = interaction.options.getString("query");
		const next = interaction.options.getBoolean("next");
		const userName: string = interaction.user.username;
		if (query) {
			handleReply(interaction, getResource("track_add_w", query));
			controller.addMusic(query, interaction.user.id, !!next).then((result) => {
				const videoEmbed = new EmbedBuilder();
				if (result?.type === TrackType.playlist) {
					videoEmbed.setAuthor({name: getResource(!!next ? "track_add_playlist_next" :"track_add_playlist")});
					videoEmbed.addFields({name: getResource("track_add_playlist_n"), value: result?.queue?.length?.toString()})
				}
				else {
					videoEmbed.setAuthor({name: getResource(!!next ? "track_add_next" : "track_add")});
				}
				videoEmbed.setTitle(result.track.name);
				videoEmbed.setURL(result.track.url);
				videoEmbed.setFooter({text: getResource("track_user_name", userName)})
				videoEmbed.setThumbnail(result.track.thumbnailUrl);
				handleEditReplyEmbed(interaction, videoEmbed);
			}).catch((e) => {
				handleEmbedError(interaction, getResource(e), false, true);
			})
			return;
		} else	handleEmbedError(interaction, getResource("track_no_query"));
	}
}