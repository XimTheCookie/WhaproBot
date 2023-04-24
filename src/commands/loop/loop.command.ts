import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { LoopMode } from "../../models/enums/LoopMode.enum";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

export const loop = 
{
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription(getResource("command_loop_dsc"))
		.addStringOption((option) => 
			option.setName("mode")
			.setDescription(getResource("command_loop_dsc_mode"))
			.setRequired(true)
			.addChoices({
				name: "Single",
				value: "SINGLE"
			}, {
				name: "Queue",
				value: "QUEUE"
			}, {
				name: "Off",
				value: "OFF"
			})
			
		),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		if (!voice || voice?.id !== controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("user_not_same_voice"));
			return;
		}
		const newMode: LoopMode = <LoopMode>(interaction.options.getString("mode") ?? LoopMode.off);
		const loopEmbed = new EmbedBuilder();
		loopEmbed.setAuthor({name: getResource("queue_loop_title")})
		controller.loop(newMode);
		loopEmbed.setTitle(getResource("queue_loop_" + newMode));
		handleReplyEmbed(interaction, loopEmbed);
	}
}