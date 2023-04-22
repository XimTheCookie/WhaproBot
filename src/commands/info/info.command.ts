import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const info = 
{
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription(getResource("command_info_dsc"))
		.addIntegerOption(option => 
			option.setName("index")
				.setDescription(getResource("command_info_dsc_option_index"))
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		const index = interaction.options.getInteger("index");
		if(!index || index < 1 || index > controller.getQueue().length) {
			handleReply(interaction, getResource("queue_info_no_index", index ? index.toString() : "0"), true);
			return;
		}
		const track = controller.getQueue()[index - 1];
		if(track) {
			handleReply(interaction, `${getResource("queue_info", track?.name, track?.url, index.toString())}\n\n${getResource("track_user", track?.userId)}`);
		} else handleReply(interaction, getResource("queue_info_no_index", index ? index.toString() : ""));
	}
}