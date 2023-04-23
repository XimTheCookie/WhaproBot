import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReplyEmbed } from "../../utils/utils";
import { commands } from "../commands";

export const help = 
{
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(getResource("command_help_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller?: MusicController, guild?: Guild, voice?: VoiceBasedChannel | null) {
		const helpEmbed = new EmbedBuilder();
		const fields: any[] = [{name: "/help", value: getResource(`command_help`)}];
		commands.forEach((c) => fields.push({name: `/${c?.data?.name}`, value: getResource(`command_${c?.data?.name}`)}));
		helpEmbed.addFields(fields);
		helpEmbed.setFooter({text: getResource("command_help_footer")})
		handleReplyEmbed(interaction, helpEmbed, true);
	}
}