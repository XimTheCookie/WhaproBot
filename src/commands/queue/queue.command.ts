
import { ChatInputCommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { Configuration } from "../../configuration";
import { LoopMode } from "../../models/enums/LoopMode.enum";
import { MusicController } from "../../music.controller";
import { getResource, handleEmbedError, handleReplyEmbed } from "../../utils/utils";

const itemsPerPage: number = Configuration.getItemsPerQueuePage() ?? 15;

export const queue = 
{
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription(getResource("command_queue_dsc"))
		.addIntegerOption(option => 
			option.setName("page")
				.setDescription(getResource("command_queue_dsc_option_page"))
				.setRequired(false)
			),
	async execute(interaction: ChatInputCommandInteraction, controller: MusicController, guild: Guild, voice: VoiceBasedChannel | null) {
		if (!controller.getConnection()?.joinConfig?.channelId) {
			handleEmbedError(interaction, getResource("bot_not_voice"));
			return;
		}
		const input: number = interaction.options.getInteger("page") ?? 1;
		const inputPage: number = input < 1 ? 1 : input;
		const queue = controller.getQueue();
		const track = controller.nowPlaying();

		const queueEmbed = new EmbedBuilder();

		// let print: string = `${getResource("queue_title", guild.name)}\n\n`;
		queueEmbed.setAuthor({name: getResource("queue_title", guild.name)});
		if (track) {
			queueEmbed.setTitle(getResource("track_current_short", track.name));
			queueEmbed.setURL(track.url);
		}
		
		if (queue.length > 0) {
			const maxPages: number = Math.ceil(queue?.length / itemsPerPage);

			const requiredPage: number = inputPage >= maxPages ? maxPages : inputPage < 1 ? 1 : inputPage;

			const startIndex = (requiredPage - 1) * itemsPerPage;
			const endIndex = itemsPerPage * requiredPage > queue.length ? queue.length : itemsPerPage * requiredPage;
			
			const pageItems = queue.slice(startIndex, endIndex);

			const fieldValues: any[] = [{name: getResource("queue_list"), value: " "}];
			
			
			pageItems.forEach((t, i) => 
				fieldValues.push({
					name: getResource("queue_list_item", (i + startIndex + 1).toString(), t?.name),
					value: t?.url
				}));
			queueEmbed.setFields(fieldValues);
			queueEmbed.setFooter({text: getResource("queue_page", requiredPage.toString(), maxPages.toString(), queue?.length?.toString() )});
		} else queueEmbed.setFields({name: getResource("queue_none"), value: " " })
		if (controller.loopStatus() !== LoopMode.off) queueEmbed.setDescription(getResource("queue_loop_" + controller.loopStatus()));
	
		handleReplyEmbed(interaction, queueEmbed);
	}
}