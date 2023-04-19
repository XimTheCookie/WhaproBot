import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { commands } from "./commands/commands";
import { Configuration } from "./configuration";


const rest = new REST().setToken(Configuration.getToken());
const deploy: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

commands.forEach((e) => deploy.push(e.data.toJSON()));

(async () => {
	try {
		console.log(`Updating ${commands.length} commands!`);
		rest.put(
			Routes.applicationCommands(Configuration.getClientId()),
			
			{ body: deploy }
		).then(() => {
			console.log("Done!");
		});

	} catch (e) {
		console.error(e);
	}
})();