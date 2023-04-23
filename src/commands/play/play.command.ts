import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { TrackType } from "../../models/enums/TrackType.enum";
import { MusicController } from "../../music.controller";
import { getResource, handleEditReply, handleEditReplyEmbed, handleReply } from "../../utils/utils";

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
			handleReply(interaction, getResource("user_not_voice"), true);
			return;
		}

		if (!voice.joinable) {
			if (controller.getConnection()?.joinConfig?.channelId !== voice.id) {
				handleReply(interaction, getResource("bot_cannot_join"), true);
				return;
			}
			
		}
		
		const currentChannelId = controller.getConnection(guild, voice.id)?.joinConfig?.channelId;

		if (currentChannelId !== voice.id) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
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
					videoEmbed.setAuthor({name: getResource("track_add_playlist")});
					videoEmbed.addFields({name: getResource("track_add_playlist_n"), value: result?.queue?.length?.toString()})
				}
				else {
					videoEmbed.setAuthor({name: getResource("track_add")});
				}
				videoEmbed.setTitle(result.track.name);
				videoEmbed.setURL(result.track.url);
				videoEmbed.setFooter({text: getResource("track_user_name", userName)})
				videoEmbed.setThumbnail(result.track.thumbnailUrl);
				handleEditReplyEmbed(interaction, videoEmbed);
			}).catch((e) => {
				handleEditReply(interaction, getResource(e));
			})
			return;
		} else	handleReply(interaction, getResource("track_no_query"), true);
	}
}