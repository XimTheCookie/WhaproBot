import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const join = 
{
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join your voice channel!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!voice) {
			await interaction.reply(getResource("user_not_voice"));
			return;
		}
		if (controller.getConnection()?.joinConfig?.channelId === voice?.id) {
			await interaction.reply(getResource("user_same_voice"));
			return;
		}
		if (!voice?.joinable) {
			await interaction.reply(getResource("bot_cannot_join"));
			return;
		}
		
		controller.newConnection(guild, voice.id);
		await interaction.reply(getResource("bot_join", voice.id));
	}
}