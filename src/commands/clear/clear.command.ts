import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const clear = 
{
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription(getResource("command_clear_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}

		const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;

		if (voice.members.size > 3 && !controller.canUseDJCommands(member)) {
			handleReply(interaction, getResource("user_not_perm"), true);
			return;
		} 
		
		const length = controller.getQueue().length;
		controller.clear();
		handleReply(interaction, getResource("queue_clear", length.toString()));
	}
}