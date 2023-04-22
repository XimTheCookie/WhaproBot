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
		
		controller.newConnection(guild, voice.id);
		handleReply(interaction, getResource("bot_join", voice.id));
	}
}