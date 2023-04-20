import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const loop = 
{
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the queue!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"));
			return;
		}
		if (controller.loop()) handleReply(interaction, getResource("queue_loop_e"));
		else handleReply(interaction, getResource("queue_loop_d"));
	}
}