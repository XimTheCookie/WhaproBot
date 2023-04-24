import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed, hasSetDJPerm } from "../../utils/utils";

export const setdj = 
{
	data: new SlashCommandBuilder()
		.setName("setdj")
		.setDescription(getResource("command_setdj_dsc"))
		.addRoleOption(option => 
			option.setName("role")
				.setDescription(getResource("command_setdj_dsc_option_role"))
				.setRequired(false) 
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {

		const member = guild.members.cache.find((u) => u?.id === interaction.user.id)!;
		const hasPerms = hasSetDJPerm(member);
		if (!hasPerms) {
			handleEmbedError(interaction, getResource("user_not_perm"));
			return;
		} 
		const roleId: string = interaction.options.getRole("role")?.id ?? "";
		const roleName: string = interaction.options.getRole("role")?.name ?? "";
		const oldRoleId = controller.getDJRole();
		const setdjEmbed = new EmbedBuilder();
		setdjEmbed.setAuthor({name: getResource("bot_set_dj_title")});
		if (roleId === oldRoleId) {
			if (!roleId) setdjEmbed.setTitle(getResource("bot_set_dj_none"));
			else setdjEmbed.setTitle(getResource("bot_set_dj_already", roleName));
		} else {
			controller.setDJRole(roleId);
			if (roleId) setdjEmbed.setTitle(getResource("bot_set_dj_new", roleName));
			else setdjEmbed.setTitle(getResource("bot_set_dj_remove"));
		}
		handleReplyEmbed(interaction, setdjEmbed);
		
	}
}