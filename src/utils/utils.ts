import lang from "../resources/lang/lang.json";

export function ArrayShuffle(Array: Array<any>) {
	let index: number = Array.length;
	let randomIndex: number;
	while (index > 0) {
		randomIndex = Math.floor(Math.random()* index);
		index--;

		[Array[index], Array[randomIndex]] = [Array[randomIndex], Array[index]];
	}
	return Array;
}

export function ArrayMove(Array: Array<any>, oldIndex: number, newIndex: number) {
	[Array[oldIndex], Array[newIndex]] = [Array[newIndex], Array[oldIndex]]
	return Array;
}

export function ArrayRemove(Array: Array<any>, index: number) {
	let item = Array[index];
	Array.splice(index, 1);
	return item;
}

export function getResource(id: string, arg0?: string, arg1?: string, arg2?: string) {
	let string: string | undefined = (lang as any)[id];
	if(string) {
		if (arg0 && string.includes("{arg0}")) 
			string = string.replace("{arg0}", arg0);
		if (arg1 && string.includes("{arg1}")) 
			string = string.replace("{arg1}", arg1);
		if (arg2 && string.includes("{arg2}")) 
			string = string.replace("{arg2}", arg2);
		return string;
	}
	return id;
}

export function getYoutubeVideoCode(url: string) {
	const videoPrefix: string = "watch?v=";
	const playlistPrefix: string = "&list";
	if (!url.includes(videoPrefix)) return "";
	return url.slice(url.indexOf(videoPrefix) + videoPrefix.length, url.indexOf(playlistPrefix) ?? url.length);
}

export function getYoutubePlaylistCode(url: string) {
	const videoPlaylistPrefix: string = "&list=";
	const videoPlaylistSuffix: string = "&index";
	const videoPlaylistSuffixPublic: string = "&start";
	const playlistPrefix: string = "playlist?list=";
	if (!url.includes(videoPlaylistPrefix) && !url.includes(playlistPrefix)) return "";
	if (url.includes(videoPlaylistPrefix)) 
		return url.slice(url.indexOf(videoPlaylistPrefix) + videoPlaylistPrefix.length, url.includes(videoPlaylistSuffix) ? url.indexOf(videoPlaylistSuffix) : url.includes(videoPlaylistSuffixPublic) ? url.indexOf(videoPlaylistSuffixPublic) : url.length);
	return url.slice(url.indexOf(playlistPrefix) + playlistPrefix.length, url.length);
}