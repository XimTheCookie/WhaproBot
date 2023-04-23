import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEditReplyEmbed, handleReply } from "../../utils/utils";

export const loop = 
{
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription(getResource("command_loop_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}
		const loopEmbed = new EmbedBuilder();
		loopEmbed.setAuthor({name: getResource("queue_loop_title")})
		if (controller.loop()) loopEmbed.setTitle(getResource("queue_loop_e"));
		else loopEmbed.setTitle(getResource("queue_loop_d"));
		handleEditReplyEmbed(interaction, loopEmbed);
	}
}