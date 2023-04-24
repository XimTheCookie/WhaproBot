import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const join = 
{
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription(getResource("command_join_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!voice) {
			handleEmbedError(interaction, getResource("user_not_voice"));
			return;
		}
		if (controller.getConnection()?.joinConfig?.channelId === voice?.id) {
			handleEmbedError(interaction, getResource("user_same_voice"));
			return;
		}
		if (!voice?.joinable) {
			handleEmbedError(interaction, getResource("bot_cannot_join"));
			return;
		}

		
		const botChannelId = controller.getConnection()?.joinConfig?.channelId;
		if (botChannelId) {
			const usersInOldVoice = (guild.channels.cache.get(botChannelId) as VoiceBasedChannel)?.members?.size;
			const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;
			if (usersInOldVoice && usersInOldVoice > 1 && !controller.canUseDJCommands(member)) {
				handleEmbedError(interaction, getResource("user_not_perm"));
				return;
			}
		}
		
		controller.newConnection(guild, voice.id);
		handleReplyEmbed(interaction, new EmbedBuilder().setTitle(getResource("bot_join", voice.id)));
	}
}