import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const loop = 
{
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the queue!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("user_not_same_voice"));
			return;
		}
		if (controller.loop()) await interaction.reply(getResource("queue_loop_e"));
		else await interaction.reply(getResource("queue_loop_d"));
	}
}