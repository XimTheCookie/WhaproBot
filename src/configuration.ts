import { LogType } from "./models/enums/LogType.enum";
import { getResource, log } from "./utils/utils";

export class Configuration {
	
	static getToken() {
		const token: string | undefined = process?.env?.token;
		if (!token) {
			log(getResource("system_missing_token"), LogType.warn);
			process.exit(1);
		}
		return token;
	}

	static getClientId() {
		const botClientId: string | undefined = process.env?.botClientId;
		if (!botClientId) {
			log(getResource("system_missing_clientid"), LogType.warn);
			process.exit(1);
		}
		return botClientId;
	}

	static getItemsPerQueuePage() {
		const queueListItems: string | undefined = process.env?.queueListItems;
		if (!queueListItems) {
			log(getResource("system_not_valid_ipp"), LogType.warn);
			process.exit(1);
		}
		const qli: number = parseInt(queueListItems);
		if (qli < 1) {
			log(getResource("system_not_valid_ipp"), LogType.warn);
			process.exit(1);
		}
		return qli;
	}

	static useLog() {
		const useLog: string | undefined = process.env?.useLog;
		return useLog == 'true';
	}

	static getSettingsPath() {
		const serverSettingsPath: string | undefined = process.env?.serverSettingsPath;
		if (!serverSettingsPath) {
			log(getResource("system_missing_settings_path"), LogType.warn);
			process.exit(1);
		}
		return serverSettingsPath;
	}

	static getInactivitySeconds() {
		const inactivitySeconds: string | undefined = process.env?.inactivitySeconds;
		if (!inactivitySeconds) {
			log(getResource("system_not_valid_ipp"), LogType.warn);
			process.exit(1);
		}
		const is: number = parseInt(inactivitySeconds);
		if (is < 0) {
			log(getResource("system_not_valid_is"), LogType.warn);
			process.exit(1);
		}
		return is;
	}

	static getAloneSeconds() {
		const aloneSeconds: string | undefined = process.env?.aloneSeconds;
		if (!aloneSeconds) {
			log(getResource("system_not_valid_ipp"), LogType.warn);
			process.exit(1);
		}
		const as: number = parseInt(aloneSeconds);
		if (as < 0) {
			log(getResource("system_not_valid_as"), LogType.warn);
			process.exit(1);
		}
		return as;
	}

	static getEmbedColor() {
		const embedColor: string | undefined = process.env?.hexEmbedColor;
		if (!embedColor) {
			log(getResource("system_missing_hex_color"), LogType.warn);
			process.exit(1);
		}
		return embedColor;
	}

}