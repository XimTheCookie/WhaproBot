import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const move = 
{
	data: new SlashCommandBuilder()
		.setName("move")
		.setDescription(getResource("command_move_dsc"))
		.addIntegerOption(option1 => 
			option1.setName("first")
				.setDescription(getResource("command_move_dsc_option_first"))
				.setRequired(true) 
			)
		.addIntegerOption(option2 => 
			option2.setName("second")
				.setDescription(getResource("command_move_dsc_option_second"))
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}
		const firstIndex = interaction.options.getInteger("first");
		const secondIndex = interaction.options.getInteger("second");
		if (firstIndex === null || secondIndex == null || firstIndex < 1 || secondIndex < 1) {
			handleEmbedError(interaction, getResource("queue_move_invalid"));
			return;
		}
		if (controller.getQueue().length < firstIndex) {
			handleEmbedError(interaction, getResource("queue_move_no_index", firstIndex.toString()));
			return;
		}
		if (controller.getQueue().length < secondIndex) {
			handleEmbedError(interaction, getResource("queue_move_no_index", secondIndex.toString()));
			return;
		}
		const moveEmbed = new EmbedBuilder();
		moveEmbed.setAuthor({name: getResource("queue_move_title")});
		const firstName = controller.getQueue()[firstIndex - 1]?.name;
		if (firstIndex === secondIndex) {
			moveEmbed.setTitle(getResource("queue_move_itself"));
			moveEmbed.addFields([
				{
					name: getResource("queue_move_new_position", firstIndex?.toString()),
					value: firstName
				},
				{
					name: getResource("queue_move_new_position", secondIndex?.toString()),
					value: firstName
				}
			]);
		} else {
			const secondName = controller.getQueue()[secondIndex - 1]?.name;
			controller.switch(firstIndex - 1, secondIndex - 1);
			moveEmbed.setTitle(getResource("queue_move"));
			moveEmbed.addFields([
				{
					name: getResource("queue_move_new_position", firstIndex?.toString()),
					value: secondName
				},
				{
					name: getResource("queue_move_new_position", secondIndex?.toString()),
					value: firstName
				}
			]);
		}
		
		handleReplyEmbed(interaction, moveEmbed);
		
	}
}