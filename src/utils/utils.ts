import { ChatInputCommandInteraction } from "discord.js";
import { Configuration } from "../configuration";
import { LogType } from "../models/enums/LogType.enum";
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
	let videoPrefix: string = "watch?v=";
	let possibleSuffix: string = "&list";
	if (!url.includes(videoPrefix)) {
		videoPrefix = "youtu.be/";
		possibleSuffix = "?";
		if (!url.includes(videoPrefix)) return "";
	}
	return url.slice(url.indexOf(videoPrefix) + videoPrefix.length, url.includes(possibleSuffix) ? url.indexOf(possibleSuffix) : url.length);
}

export function getYoutubePlaylistCode(url: string) {
	const videoPlaylistPrefix: string = "&list=";
	const videoPlaylistSuffix: string = "&index";
	const videoPlaylistSuffixPublic: string = "&start";
	const playlistPrefix: string = "playlist?list=";
	if (url.includes(videoPlaylistSuffixPublic) || !url.includes(videoPlaylistPrefix) && !url.includes(playlistPrefix)) return "";
	if (url.includes(videoPlaylistPrefix)) 
		return url.slice(url.indexOf(videoPlaylistPrefix) + videoPlaylistPrefix.length, url.includes(videoPlaylistSuffix) ? url.indexOf(videoPlaylistSuffix) : url.includes(videoPlaylistSuffixPublic) ? url.indexOf(videoPlaylistSuffixPublic) : url.length);
	return url.slice(url.indexOf(playlistPrefix) + playlistPrefix.length, url.length);
}

export async function handleReply(interaction: ChatInputCommandInteraction, message: string, ephemeral: boolean = false) {
	return interaction
		.reply({
			content: message,
			ephemeral
		})
		.catch((e) => log(e, LogType.error));
}

export async function handleEditReply(interaction: ChatInputCommandInteraction, message: string, ephemeral: boolean = false) {
	return interaction
		.editReply({
			content: message
		})
		.catch((e) => log(e, LogType.error));
}

export function log(content: string, type: LogType = LogType.info) {
	if (!Configuration.useLog()) return;
	const message = getResource("system_log", getResource("system_log_type_" + type), new Date().toString(), content);
	if (type === LogType.info) console.log(message);
	else if (type === LogType.error) console.error(message);
	else console.warn(message);
}