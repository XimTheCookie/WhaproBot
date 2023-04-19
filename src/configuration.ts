import config from "./configuration.json";

export class Configuration {
	
	static getToken() {
		return config.token;
	}

	static getClientId() {
		return config.botClientId;
	}

	static getItemsPerQueuePage() {
		return config.queueListItems;
	}
}