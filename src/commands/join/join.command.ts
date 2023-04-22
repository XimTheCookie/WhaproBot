import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

export const join = 
{
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription(getResource("command_join_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!voice) {
			handleReply(interaction, getResource("user_not_voice"), true);
			return;
		}
		if (controller.getConnection()?.joinConfig?.channelId === voice?.id) {
			handleReply(interaction, getResource("user_same_voice"), true);
			return;
		}
		if (!voice?.joinable) {
			handleReply(interaction, getResource("bot_cannot_join"), true);
			return;
		}

		
		const botChannelId = controller.getConnection()?.joinConfig?.channelId;
		if (botChannelId) {
			const usersInOldVoice = (guild.channels.cache.get(botChannelId) as VoiceBasedChannel)?.members?.size;
			const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;
			if (usersInOldVoice && usersInOldVoice > 1 && !controller.canUseDJCommands(member)) {
				handleReply(interaction, getResource("user_not_perm"), true);
				return;
			}
		}
		
		controller.newConnection(guild, voice.id);
		handleReply(interaction, getResource("bot_join", voice.id));
	}
}