import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { commands } from "./commands/commands";
import { help } from "./commands/help/help.command";
import { Configuration } from "./configuration";
import { LogType } from "./models/enums/LogType.enum";
import { getResource, log } from "./utils/utils";


const rest = new REST().setToken(Configuration.getToken());
const deploy: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

commands.forEach((e) => deploy.push(e.data.toJSON()));
deploy.push(help.data.toJSON());

(async () => {
	try {
		log(getResource("commands_deploy", deploy?.length?.toString()))
		rest.put(
			Routes.applicationCommands(Configuration.getClientId()),
			
			{ body: deploy }
		).then(() => {
			log(getResource("commands_deploy_c"));
		});

	} catch (e) {
		log("commands_deploy_e", LogType.error);
	}
})();