import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const remove = 
{
	data: new SlashCommandBuilder()
		.setName("remove")
		.setDescription("Remove a track from queue.")
		.addIntegerOption(option => 
			option.setName("index")
				.setDescription("Index of the song to remove.")
				.setRequired(true) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			await interaction.reply(getResource("user_not_same_voice"));
			return;
		}
		const index = interaction.options.getInteger("index");
		const removedTrack = index ? controller.remove(index - 1) : undefined;
		if (removedTrack) await interaction.reply(getResource("track_removed", removedTrack));
		else await interaction.reply(getResource("track_not_removed", index?.toString()));
	}
}