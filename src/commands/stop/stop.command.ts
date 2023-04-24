import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const stop = 
{
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription(getResource("command_stop_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}

		const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;

		if (voice.members.size > 3 && !controller.canUseDJCommands(member)) {
			handleEmbedError(interaction, getResource("user_not_perm"));
			return;
		} 
		
		controller.deleteConnection();
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("bot_leave")));
	}
}