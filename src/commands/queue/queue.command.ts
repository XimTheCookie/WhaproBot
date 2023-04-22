
import { ChatInputCommandInteraction, Guild, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { Configuration } from "../../configuration";
import { MusicController } from "../../music.controller";
import { getResource, handleReply } from "../../utils/utils";

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
			handleReply(interaction, getResource("bot_not_voice"));
			return;
		}
		const input: number = interaction.options.getInteger("page") ?? 1;
		const inputPage: number = input < 1 ? 1 : input;
		const queue = controller.getQueue();
		const track = controller.nowPlaying();
		let print: string = `${getResource("queue_title", guild.name)}\n\n`;
		if (track) {
			print = print + `${getResource("track_current_short", track.name)}\n\n`;
		}
		
		if (queue.length > 0) {
			print = print + `${getResource("queue_list")}\n`;
			print = print + "```json\n";
			
			const pages: number = Math.floor(queue?.length / itemsPerPage);
			const maxPages: number = Math.ceil(queue?.length / itemsPerPage);

			const requiredPage: number = inputPage >= maxPages ? maxPages : inputPage < 1 ? 1 : inputPage;

			const startIndex = (requiredPage - 1) * itemsPerPage;
			const endIndex = itemsPerPage * requiredPage > queue.length ? queue.length : itemsPerPage * requiredPage;
			
			const pageItems = queue.slice(startIndex, endIndex);
			
			
			pageItems.forEach((t, i) => {
				print = print + `${getResource("queue_list_item", (i + startIndex + 1).toString(), t?.name)}\n`;
			});
			print = print + `\n${getResource("queue_page", requiredPage.toString(), maxPages.toString())}`;
			print = print + "\n```";
		} else print = print + `${getResource("queue_none")}\n`;
		
		if (controller.loopStatus()) {
			print = print + `\n${getResource("queue_loop_on")}`;
		}

		await handleReply(interaction, print);
	}
}