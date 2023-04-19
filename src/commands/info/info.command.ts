import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const info = 
{
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Info about a track in queue!")
		.addIntegerOption(option => 
			option.setName("index")
				.setDescription("Index of the track.")
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		const index = interaction.options.getInteger("index");
		if(!index || index < 1 || index > controller.getQueue().length) {
			await interaction.reply(getResource("queue_info_no_index", index ? index.toString() : "0"));
			return;
		}
		const track = controller.getQueue()[index - 1];
		if(track) {
			await interaction.reply(`${getResource("queue_info", track?.name, track?.url, index.toString())}\n\n${getResource("track_user", track?.userId)}`);
		} else await interaction.reply(getResource("queue_info_no_index", index ? index.toString() : ""));
	}
}