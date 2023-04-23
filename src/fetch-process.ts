import { parentPort, workerData } from "worker_threads";
import yts from "yt-search";
import { QueueItem } from "./models/QueueItem.model";
import { TrackAdd } from "./models/TrackAdd.model";
import { TrackType } from "./models/enums/TrackType.enum";
import { getYoutubePlaylistCode, getYoutubeVideoCode } from "./utils/utils";

const exit = async () => {
	setTimeout(() => {
		process.exit(0);
	}, 1000);
};

const queue: QueueItem[] = [];

const [query, userId] = workerData;

new Promise<TrackAdd>((resolve, reject) => {
	const add = (title: string, url: string, thumbnailUrl: string) => {
		queue.push({
			name: title,
			url: url,
			thumbnailUrl: thumbnailUrl,
			userId: userId
		});
		resolve({
			track: {
				name: title,
				url: url,
				userId: userId,
				thumbnailUrl: thumbnailUrl
			},
			type: TrackType.video,
			queue: queue
		});
	};
	const fromPlaylist = (pCode: string, code: string) => {
		yts({listId: pCode}, (error, data) => {
			if (error) {
				if (code) fromCode(code);
				else reject("track_error_playlist");
				return;
			}
			if (data?.videos?.length > 0) {
				data.videos.forEach((v) => {
					if (v?.videoId)
						queue.push(
							{
								name: v?.title, url: "https://www.youtube.com/watch?v=" + v?.videoId, userId, thumbnailUrl: v?.thumbnail
							}
						);
				});
				resolve({
					track: {
						name: data?.title,
						url: data?.url,
						userId: userId,
						thumbnailUrl: data?.thumbnail
					},
					type: TrackType.playlist,
					queue: queue
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
				add(title, url, data?.videos[0]?.thumbnail);
			} else reject("track_error_no_results");
		});
	};
	const fromCode = (code: string) => {
		yts({videoId: code}, (error, data) => {
			if (error) reject("track_error");
			const title = data?.title
			const url = data?.url;
			const thumbnail = data?.thumbnail;
			add(title, url, thumbnail);
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
.then((result) => {
	exit();
	parentPort?.postMessage(result);
})
.catch((e) => {
	exit();
	parentPort?.postMessage(e);
});