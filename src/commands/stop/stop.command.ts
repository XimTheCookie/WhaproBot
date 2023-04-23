import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply, handleReplyEmbed } from "../../utils/utils";

export const stop = 
{
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription(getResource("command_stop_dsc")),
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
		
		controller.deleteConnection();
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("bot_leave")));
	}
}