import { readFile } from "fs";
import { Worker } from "worker_threads";
import { Configuration } from "./configuration";
import { GuildSettings } from "./models/GuildSettings.model";
const getLocation = (id: string) => `${Configuration.getSettingsPath()}${id}.json`

export class SettingsService {
	static getSettings(guildId: string) {
		return new Promise<GuildSettings>((resolve, reject) => {
			try {
				readFile(getLocation(guildId), "utf-8", (err, data) => {
					if(err) reject()
					else resolve(JSON.parse(data));
				})
			} catch (e) {}
		});
	}

	static saveSettings(guildId: string, settings: GuildSettings) {
		return new Promise<GuildSettings>((resolve, reject) => {
			const jsonProcesser = new Worker("./output/json-process.js", {workerData: [guildId, settings]});
			jsonProcesser.on("message", (result) => {
				if (result) resolve(result);
				else reject();
			});
		});
	}
}