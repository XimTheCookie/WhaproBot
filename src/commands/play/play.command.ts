import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { TrackType } from "../../models/enums/TrackType.enum";
import { MusicController } from "../../music.controller";
import { getResource, handleEditReply, handleReply } from "../../utils/utils";

export const play = 
{
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription(getResource("command_play_dsc"))
		.addStringOption(option => 
			option.setName("query")
				.setDescription(getResource("command_play_dsc_option_query"))
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		
		if (!voice) {
			handleReply(interaction, getResource("user_not_voice"));
			return;
		}

		if (!voice.joinable) {
			handleReply(interaction, getResource("bot_cannot_join"));
			return;
		}
		

		const currentChannelId = controller.getConnection(guild, voice.id)?.joinConfig?.channelId;

		if (currentChannelId !== voice.id) {
			handleReply(interaction, getResource("user_not_same_voice"));
			return;
		}

		const query = interaction.options.getString("query");

		if (query) {
			handleReply(interaction, getResource("track_add_w", query));
			controller.addMusic(query, interaction.user.id).then((result) => {
				if (result?.type === TrackType.playlist)
					handleEditReply(interaction, getResource("track_add_playlist", `${result.track.name} ${getResource("track_add_playlist_n", result?.queue?.length?.toString())}`, result?.track?.url))
				else
					handleEditReply(interaction, getResource("track_add", result?.track?.name, result?.track?.url));
			}).catch((e) => {
				handleEditReply(interaction, getResource(e));
			})
			return;
		} else	handleReply(interaction, getResource("track_no_query"));
	}
}