import { LogType } from "./models/enums/LogType.enum";
import { getResource, log } from "./utils/utils";

export class Configuration {

	static token: string | undefined = undefined; 

	static botClientId: string | undefined = undefined;

	static adminClientId: string | undefined = undefined;

	static queueListItems: number = 0;

	static shouldUseLog: string | undefined = undefined;

	static serverSettingsPath: string | undefined = undefined;

	static inactivitySeconds: number = -1;

	static aloneSeconds: number = -1;

	static embedColor: string | undefined = undefined;

	static getToken() {
		return this.token ?? this.fetchToken();
	}

	static fetchToken() {
		log("Loading: token", LogType.info);
		this.token = process?.env?.token;
		if (!this.token) {
			log(getResource("system_missing_token"), LogType.error);
			process.exit(1);
		}
		return this.token;
	}

	static getClientId() {
		return this.botClientId ?? this.fetchClientId();
	}

	static fetchClientId() {
		log("Loading: botClientId", LogType.info);
		this.botClientId = process.env?.botClientId;
		log((this.botClientId ?? " ").toString(), LogType.info);
		if (!this.botClientId) {
			log(getResource("system_missing_clientid"), LogType.error);
			process.exit(1);
		}
		log((this.botClientId ?? " ").toString(), LogType.info);
		return this.botClientId;
	}

	static getAdminClientId() {
		return this.adminClientId ?? this.fetchAdminClientId();
	}

	static fetchAdminClientId() {
		log("Loading: adminClientId", LogType.info);
		this.adminClientId = process.env?.adminClientId;
		log((this.adminClientId ?? " ").toString(), LogType.info);
		if (!this.adminClientId) this.adminClientId = "none";
		log((this.adminClientId ?? " ").toString(), LogType.info);
		return this.adminClientId;
	}

	static getItemsPerQueuePage() {
		return this.queueListItems === 0 ? this.fetchItemsPerQueuePage() : this.queueListItems;
	}

	static fetchItemsPerQueuePage() {
		log("Loading: queueListItems", LogType.info);
		const queueListItems: string | undefined = process.env?.queueListItems;
		log((this.queueListItems ?? " ").toString(), LogType.info);
		if (!queueListItems) {
			log(getResource("system_not_valid_ipp"), LogType.error);
			process.exit(1);
		}
		this.queueListItems = parseInt(queueListItems);
		if (this.queueListItems < 1 || this.queueListItems > 32) {
			log(getResource("system_not_valid_ipp"), LogType.error);
			process.exit(1);
		}
		log((this.queueListItems ?? " ").toString(), LogType.info);
		return this.queueListItems;
	}

	static useLog() {
		const useLog: string | undefined = process.env?.useLog;
		return (this.shouldUseLog ?? this.fetchUseLog() ) === "true";
	}

	static fetchUseLog() {
		this.shouldUseLog = process.env?.useLog;
		if (this.shouldUseLog !== "true") this.shouldUseLog = "false";
		console.log(this.shouldUseLog);
		return this.shouldUseLog;
	}

	static getSettingsPath() {
		return this.serverSettingsPath ?? this.fetchSettingsPath();
	}

	static fetchSettingsPath() {
		log("Loading: serverSettingsPath", LogType.info);
		this.serverSettingsPath = process.env?.serverSettingsPath;
		log((this.serverSettingsPath ?? " ").toString(), LogType.info);
		if (!this.serverSettingsPath || this.serverSettingsPath == "default") 
			this.serverSettingsPath = "/media/serverSettings/";
		log((this.serverSettingsPath ?? " ").toString(), LogType.info);
		return this.serverSettingsPath;
	}

	static getInactivitySeconds() {
		return this.inactivitySeconds !== -1 ? this.inactivitySeconds : this.fetchInactivitySeconds();
	}

	static fetchInactivitySeconds () {
		log("Loading: inactivitySeconds", LogType.info);
		const inactivitySeconds: string | undefined = process.env?.inactivitySeconds;
		log((this.inactivitySeconds ?? " ").toString(), LogType.info);
		if (!inactivitySeconds) {
			log(getResource("system_not_valid_ipp"), LogType.error);
			process.exit(1);
		}
		this.inactivitySeconds = parseInt(inactivitySeconds);
		if (this.inactivitySeconds < 0) {
			log(getResource("system_not_valid_is"), LogType.error);
			process.exit(1);
		}
		log((this.inactivitySeconds ?? " ").toString(), LogType.info);
		return this.inactivitySeconds;
	}

	static getAloneSeconds() {
		return this.aloneSeconds !== -1 ? this.aloneSeconds : this.fetchAloneSeconds();
	}

	static fetchAloneSeconds() {
		log("Loading: aloneSeconds", LogType.info);
		const aloneSeconds: string | undefined = process.env?.aloneSeconds;
		log((this.aloneSeconds ?? " ").toString(), LogType.info);
		if (!aloneSeconds) {
			log(getResource("system_not_valid_ipp"), LogType.error);
			process.exit(1);
		}
		this.aloneSeconds = parseInt(aloneSeconds);
		if (this.aloneSeconds < 0) {
			log(getResource("system_not_valid_as"), LogType.error);
			process.exit(1);
		}
		log((this.aloneSeconds ?? " ").toString(), LogType.info);
		return this.aloneSeconds;
	}
	
	static getEmbedColor() {
		return this.embedColor ?? this.fetchEmbedColor();
	}

	static fetchEmbedColor() {
		log("Loading: hexEmbedColor", LogType.info);
		this.embedColor = process.env?.hexEmbedColor;
		log((this.embedColor ?? " ").toString(), LogType.info);
		if (!this.embedColor) {
			log(getResource("system_missing_hex_color"), LogType.error);
			process.exit(1);
		}
		log((this.embedColor ?? " ").toString(), LogType.info);
		return this.embedColor;
	}

}
