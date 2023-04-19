import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource } from "../../utils/utils";

export const join = 
{
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join your voice channel!"),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		// TODO aggiornare i testi
		if (!voice) {
			await interaction.reply(getResource("voiceRequired"));
			return;
		}
		if (controller.getConnection()?.joinConfig?.channelId === voice?.id) {
			await interaction.reply(getResource("botAlreadyInChannel"));
			return;
		}
		controller.newConnection(guild, voice.id);
		await interaction.reply(getResource("botJoined", voice.id));
	}
}