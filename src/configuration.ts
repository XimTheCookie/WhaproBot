import config from "./configuration.json";
import { LogType } from "./models/enums/LogType.enum";
import { getResource, log } from "./utils/utils";

export class Configuration {
	
	static getToken() {
		const token: string = config?.token;
		if (!token) {
			log(getResource("system_missing_token"), LogType.warn);
			process.exit(1);
		}
		return token;
	}

	static getClientId() {
		const botClientId: string = config?.botClientId;
		if (!botClientId) {
			log(getResource("system_missing_clientid"), LogType.warn);
			process.exit(1);
		}
		return botClientId;
	}

	static getItemsPerQueuePage() {
		const queueListItems: number = config?.queueListItems;
		if (queueListItems < 1) {
			log(getResource("system_not_valid_ipp"), LogType.warn);
			process.exit(1);
		}
		return queueListItems;
	}

	static useLog() {
		const useLog: boolean = config?.useLog;
		return !! useLog;
	}

	static getSettingsPath() {
		const serverSettingsPath: string = config?.serverSettingsPath;
		if (!serverSettingsPath) {
			log(getResource("system_missing_settings_path"), LogType.warn);
			process.exit(1);
		}
		return serverSettingsPath;
	}

}