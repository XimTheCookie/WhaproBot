import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const np = 
{
	data: new SlashCommandBuilder()
		.setName("np")
		.setDescription(getResource("command_np_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		const track = controller.nowPlaying();
		if(track) {
			handleReply(interaction, `${getResource("track_current", track?.name, track?.url)}\n\n${getResource("track_user", track?.userId)}`);
		} else handleReply(interaction, getResource("track_current_none"));
	}
}