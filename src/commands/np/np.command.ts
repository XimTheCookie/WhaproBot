import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const np = 
{
	data: new SlashCommandBuilder()
		.setName("np")
		.setDescription("Check which track is currently playing!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		const track = controller.nowPlaying();
		if(track) {
			await interaction.reply(`${getResource("track_current", track?.name, track?.url)}\n\n${getResource("track_user", track?.userId)}`);
		} else await interaction.reply(getResource("track_current_none"));
	}
}