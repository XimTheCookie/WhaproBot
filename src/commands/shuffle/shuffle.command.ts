import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply, handleReplyEmbed } from "../../utils/utils";

export const shuffle = 
{
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription(getResource("command_shuffle_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}
		
		controller.shuffle();
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("queue_shuffle")));
	}
}