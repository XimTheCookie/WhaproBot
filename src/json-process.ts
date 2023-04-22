import { writeFileSync } from "fs";
import { parentPort, workerData } from "worker_threads";
import { Configuration } from "./configuration";

const exit = async () => {
	setTimeout(() => {
		process.exit(0);
	}, 1000);
};

const [guildId, settings] = workerData;

try {
	writeFileSync(`${Configuration.getSettingsPath()}${guildId}.json`, JSON.stringify(settings), "utf8");
} catch (e) {}
parentPort?.postMessage(settings);
exit();

