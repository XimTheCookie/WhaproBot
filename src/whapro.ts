import { HashMap } from "./models/HashMap.model";
import { MusicController } from "./music.controller";


export class WhaproClass {
	private controllers: HashMap<MusicController> = {};
	
	getController(guildId: string) {
		return this.controllers[guildId] ?? this.newController(guildId);
	}

	private newController(guildId: string) {
		this.controllers[guildId] = new MusicController(guildId);
		return this.controllers[guildId];
	}
}