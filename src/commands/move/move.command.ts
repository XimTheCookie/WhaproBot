import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const move = 
{
	data: new SlashCommandBuilder()
		.setName("move")
		.setDescription("Switch two tracks.")
		.addIntegerOption(option1 => 
			option1.setName("first")
				.setDescription("Index of the first track.")
				.setRequired(true) 
			)
		.addIntegerOption(option2 => 
			option2.setName("second")
				.setDescription("Index of the second track.")
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("user_not_same_voice"));
			return;
		}
		const firstIndex = interaction.options.getInteger("first");
		const secondIndex = interaction.options.getInteger("second");
		if (firstIndex === null || secondIndex == null || firstIndex < 1 || secondIndex < 1) {
			await interaction.reply(getResource("queue_move_invalid"));
			return;
		}
		if (controller.getQueue().length < firstIndex) {
			await interaction.reply(getResource("queue_move_no_index", firstIndex.toString()));
			return;
		}
		if (controller.getQueue().length < secondIndex) {
			await interaction.reply(getResource("queue_move_no_index", secondIndex.toString()));
			return;
		}
		if (firstIndex === secondIndex) {
			await interaction.reply(getResource("queue_move_itself"));
			return;
		}
		const firstName = controller.getQueue()[firstIndex - 1]?.name;
		const secondName = controller.getQueue()[secondIndex - 1]?.name;
		controller.switch(firstIndex - 1, secondIndex - 1);
		await interaction.reply(getResource("queue_move", firstName, secondName));
	}
}