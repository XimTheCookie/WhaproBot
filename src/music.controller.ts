import { AudioPlayer, AudioPlayerStatus, VoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Guild } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { TrackAdd } from "./models/TrackAdd.model";
import { TrackType } from "./models/enums/TrackType.enum";
import { QueueController } from "./queue.controller";
import { getYoutubePlaylistCode, getYoutubeVideoCode } from "./utils/utils";

export class MusicController {
	
	private guildId: string;
	private connection: VoiceConnection | null = null;
	private player: AudioPlayer | null = null;
	private queue = new QueueController();

	constructor(guildId: string) {
		this.guildId = guildId;
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
		let notPlaying: Date | null = new Date();

		// Whenever this player changes status from playing to idle, the next audio resource is called
		player.on("stateChange", (oldState, newState) => {
			
			if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
				notPlaying = new Date();
				setTimeout(() => {
					if(notPlaying && (notPlaying.getSeconds() + 30 >= new Date().getSeconds())) 
						this.deleteConnection();
				}, 30000);
				this.nextAudioResource();
			}
				

				if(newState.status === AudioPlayerStatus.Playing) {
					notPlaying = null;
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

		if (this.connection) {
			this.connection.removeAllListeners("stateChange");
		}

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

		this.connection = null;
	}

	async addMusic(query: string, userId: string) {
		
		return new Promise<TrackAdd | undefined>((resolve, reject) => {
			const add = (title: string, url: string) => {
				this.queue.add(title, url, userId);
				this.nextAudioResourceIfIdle();
				resolve({
					track: {
						name: title,
						url: url,
						userId: userId
					},
					type: TrackType.video
				});
			};
			const fromPlaylist = (pCode: string, code: string) => {
				yts({listId: pCode}, (error, data) => {
					if (error) {
						if (code) fromCode(code);
						else reject("track_error_playlist");
						return;
					}
					if (data?.videos?.length > 1) {
						data.videos.forEach((v) => {
							if (v?.videoId)
								this.queue.add(v?.title, "https://www.youtube.com/watch?v=" + v?.videoId, userId);
						});
						this.nextAudioResourceIfIdle();
						resolve({
							track: {
								name: data?.title,
								url: data?.url,
								userId: userId
							},
							type: TrackType.playlist
						});
					}
				});
			};
			const search = () => {
				yts(query, (error, data) => {
					if (error) reject();
					if (data.videos?.length > 0) {
						const title = data?.videos[0]?.title
						const url = data?.videos[0]?.url;
						add(title, url);
					} else reject("track_error_no_results");
				});
			};
			const fromCode = (code: string) => {
				yts({videoId: code}, (error, data) => {
					if (error) reject("track_error");
					const title = data?.title
					const url = data?.url;
					add(title, url);
				});
			};
			
			if (query.includes("youtube.com/") || query.includes("youtu.be/")) {
				const videoCode: string = getYoutubeVideoCode(query);
				const playlistCode: string = getYoutubePlaylistCode(query);
				if (playlistCode) {
					fromPlaylist(playlistCode, videoCode)
					return;
				}
				if (videoCode) {
					fromCode(videoCode);
					return;
				}
				reject("track_error_no_track");
			} else {
				search();
			}
		})
	}

	nextAudioResourceIfIdle() {
		if (this.playerStatus(AudioPlayerStatus.Idle)) {
			this.nextAudioResource();
		}
	}

	nextAudioResource() {
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
	
}