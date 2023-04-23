import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleReplyEmbed } from "../../utils/utils";

export const about = 
{
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription(getResource("command_about_dsc")),
	async execute(interaction: ChatInputCommandInteraction, controller?: MusicController, guild?: Guild, voice?: VoiceBasedChannel | null) {
		const aboutEmbed = new EmbedBuilder();
		aboutEmbed.setAuthor({name: "WhaproBot"});
		aboutEmbed.setTitle("WhaproBot by Xim_").setURL("https://github.com/XimTheCookie/WhaproBot");
		aboutEmbed.setFooter({text: "Ximmeme"});
		aboutEmbed.setDescription(getResource("custom_about"));
		handleReplyEmbed(interaction, aboutEmbed, true);
	}
}