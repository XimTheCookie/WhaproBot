import { AudioPlayer, AudioPlayerStatus, VoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Guild, GuildMember } from "discord.js";
import { Worker } from "worker_threads";
import ytdl from "ytdl-core";
import { TrackAdd } from "./models/TrackAdd.model";
import { QueueController } from "./queue.controller";
import { SettingsService } from "./settings.service";
import { getResource, hasRole, hasSetDJPerm, log } from "./utils/utils";

export class MusicController {
	
	private guildId: string;
	private djRoleId: string = "";
	private connection: VoiceConnection | null = null;
	private player: AudioPlayer | null = null;
	private queue = new QueueController();
	private inactivityTimeout: NodeJS.Timeout | null = null;
	private aloneTimeout: NodeJS.Timeout | null = null;
	private currentSkipVotes: string[] = [];

	constructor(guildId: string) {
		this.guildId = guildId;
		SettingsService.getSettings(guildId).then((result) => {
			if (result?.djRoleId)
				this.djRoleId = result?.djRoleId;
		}).catch((e) => log(e));
	}

	getPlayer() {
		// Gets the player or makes a new one if none is found
		const player: AudioPlayer = 
			this.player
			??
			this.newPlayer();
		// Returns the player
		return player;
	}

	private newPlayer() {
		// Creates a new player and stores it
		const player: AudioPlayer = createAudioPlayer();

		// Whenever this player changes status from playing to idle, the next audio resource is called
		player.on("stateChange", (oldState, newState) => {
			
			if ((oldState.status === AudioPlayerStatus.Playing || oldState.status === AudioPlayerStatus.Paused ) && newState.status === AudioPlayerStatus.Idle) {
				this.inactivityTimeout = setTimeout(() => {
					log(getResource("bot_inactivity_timeout", this.guildId));
					this.getConnection()?.destroy();
				}, 30 * 1000);
				this.nextAudioResourceIfIdle();
			}
				

				if (newState.status === AudioPlayerStatus.Playing) {
					if (this.inactivityTimeout)
						{
							clearTimeout(this.inactivityTimeout)
							this.inactivityTimeout = null;
						}
				}
		})
		

		

		// Stores the new player
		this.player = player;

		// setTimeout(() => {
		//	 if(this.playerStatus(guildId, AudioPlayerStatus.Paused)) 
		//	 this.resumePlayer(guildId);
		// }, 1000);
		

		return this.getPlayer();
	}

	deletePlayer() {
		const player = this.player;
		if (player) {
			player.removeAllListeners("stateChange");
			player.removeAllListeners("unsubscribe");
			player.stop(true);
			this.player = null;
		}
	}

	pausePlayer() {
		if(!this.playerStatus(AudioPlayerStatus.Paused))
		this.getPlayer().pause();
	}

	resumePlayer() {
		if(this.playerStatus(AudioPlayerStatus.Paused)) {
			this.getPlayer().unpause();
			this.nextAudioResourceIfIdle();
		}
	}

	getConnection(guild?: Guild, channelId?: string) {
		if(!guild || !channelId) {
			return this.connection;
		}
		// Gets the connection or makes a new one if none is found
		const connection: VoiceConnection = 
			this.connection
			??
			this.newConnection(guild, channelId);
		// Returns the connection
		return connection;
	}


	newConnection(guild: Guild, channelId: string) {
		// Create a new connection object
		const connection = 
			joinVoiceChannel({
				channelId: channelId,
				guildId: guild.id,
				adapterCreator: guild.voiceAdapterCreator
			});
		
		// Subscribe a player to this connection
		connection.subscribe(this.getPlayer());

		// connection.on("stateChange", (oldState, newState) => {
		// 	if (
		// 		(
		// 			newState.status === VoiceConnectionStatus.Destroyed 
		// 			|| 
		// 			newState.status === VoiceConnectionStatus.Disconnected
		// 		) && this.getConnection()
		// 	) 
		// 		this.deleteConnection();
		// });

		

		// Store new connection
		this.connection = connection;
		
		// Returns the new connection
		return this.connection;
	}


	deleteConnection() {
		this.clear();
		const connection = this.connection;
		if(connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
			connection.removeAllListeners("staterChange");
			connection.destroy();
		}
		const player = this.getPlayer();
		if(player) {
			this.deletePlayer();
		}
		this.stopAloneTimeout();
		this.connection = null;
	}

	async addMusic(query: string, userId: string, next: boolean) {
		return new Promise<TrackAdd>((resolve, reject) => {
			const fetcher = new Worker("./output/fetch-process.js", {workerData: [query, userId]});
			fetcher.on("message", (result: TrackAdd | string) => {
				if (typeof result === "string") {
					reject(result);	
					return;
				}
				if (result?.queue.length) {
					if (next) this.queue.getQueue().unshift(...result?.queue);
					else this.queue.getQueue().push(...result?.queue);
				}
					
				this.nextAudioResourceIfIdle()
				resolve(result);
			});
		});
	}

	nextAudioResourceIfIdle() {
		if (this.playerStatus(AudioPlayerStatus.Idle)) {
			this.nextAudioResource();
		}
	}

	nextAudioResource() {
		this.currentSkipVotes = [];
		const url = this.queue.next()?.url;
		const player = this.getPlayer();
		if (url) {
			player.play(this.newAudioResource(url));
			//this.searchAndPlay(player, url);
		} else player.stop();
	}

	newAudioResource(url: string) {
		const stream = ytdl(url, { 
			filter: "audioonly", 
			highWaterMark: 1 << 26, // 1 << 25 
			dlChunkSize: 0
		});
		stream.on("error", (e) => {
			this.nextAudioResource();
			stream.removeAllListeners("error");
		});
		return createAudioResource(stream);
	}

	// searchAndPlay(player: AudioPlayer, search: string) {
	// 	yts(search, (error, data) => {
	// 		if (data.videos?.length > 0) {
	// 			player.play(this.newAudioResource(data.videos[0].url));
	// 		}
	// 	})
	// }

	playerStatus(status: AudioPlayerStatus) {
		return this.getPlayer().state.status === status;
	}

	getQueue() {
		return this.queue.getQueue();
	}

	shuffle() {
		this.queue.shuffle();
	}

	loop() {
		return this.queue.switchLoop();
	}

	loopStatus() {
		return this.queue.getLoop();
	}

	nowPlaying() {
		return this.queue.nowPlaying();
	}

	clear() {
		this.queue.clear();
	}

	remove(index: number) {
		const item = this.queue.remove(index);
		if (item) return item.name;
		return "";
	}

	switch(firstIndex: number, secondIndex: number) {
		this.queue.move(firstIndex, secondIndex);
	}

	startAloneTimeout() {
		if (!this.aloneTimeout)
			this.aloneTimeout = setTimeout(() => {
				log(getResource("bot_alone_timeout", this.guildId));
				this.getConnection()?.destroy();
			}, 2 * 60 * 1000);
	}

	stopAloneTimeout() {
		if (this.aloneTimeout) {
			clearTimeout(this.aloneTimeout);
			this.aloneTimeout = null;
		}
	}

	setDJRole(id: string = "") {
		this.djRoleId = id;
		this.saveDJRole();
	}

	saveDJRole() {
		SettingsService.saveSettings(this.guildId, {djRoleId: this.djRoleId})
		.then((result) => console.log(result))
		.catch((e) => console.log(e))
	}

	getDJRole() {
		return this.djRoleId;
	}

	canUseDJCommands(member: GuildMember) {
		const djRoleId = this.djRoleId;
		if (djRoleId) return hasRole(member, djRoleId) || hasSetDJPerm(member);
		return hasSetDJPerm(member);
	}

	addSkipVote(uid: string, requiredToSkip: number): number | boolean {
		if (this.currentSkipVotes.includes(uid)) return false;
		this.currentSkipVotes.push(uid);
		if (this.currentSkipVotes.length >= requiredToSkip) {
			this.nextAudioResource();
			return true;
		}
			
		return this.currentSkipVotes.length;
	}
	
}