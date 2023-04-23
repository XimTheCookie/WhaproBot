import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReply, handleReplyEmbed } from "../../utils/utils";

export const clear = 
{
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription(getResource("command_clear_dsc"))
		.addUserOption((option) => 
			option.setName("user")
			.setDescription(getResource("command_clear_dsc_option_user"))
			.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("bot_not_voice"), true);
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleReply(interaction, getResource("user_not_same_voice"), true);
			return;
		}

		const removeUid = interaction.options.getUser("user")?.id;

		const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;

		if (
			(
				(voice.members.size > 3 && !removeUid)
				|| 
				(removeUid && removeUid !== interaction.user.id)
			)
			&&
			!controller.canUseDJCommands(member)
			) {
			handleReply(interaction, getResource("user_not_perm"), true);
			return;
		} 

		
		const length = controller.getQueue().length;
		controller.clear(removeUid);
		const clearEmbed = new EmbedBuilder();
		clearEmbed.setAuthor({name: getResource(removeUid ? "queue_clear_title_user" : "queue_clear_title")});
		clearEmbed.setTitle(getResource("queue_clear"));
		clearEmbed.setFields([{name: getResource("queue_clear_num"), value: length.toString()}])
		handleReplyEmbed(interaction, clearEmbed)
	}
}