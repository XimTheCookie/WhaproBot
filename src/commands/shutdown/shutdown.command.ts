import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";
import { Configuration } from "../../configuration";

export const shutdown = 
{
	data: new SlashCommandBuilder()
		.setName("shutdown")
		.setDescription(getResource("command_shutdown")),
	async execute(interaction: ChatInputCommandInteraction, controller?: MusicController, guild?: Guild, voice?: VoiceBasedChannel | null) {

		const userId = interaction.user.id;
		
		const hasPerms = Configuration.getAdminClientId().includes(userId);
		if (!hasPerms) {
			handleEmbedError(interaction, getResource("user_not_perm"));
			return;
		}
		
		const shutdownEmbed = new EmbedBuilder();
		shutdownEmbed.setTitle(getResource("bot_shutdown_title"));
		handleReplyEmbed(interaction, shutdownEmbed);
		process.exit(0);
	}
}