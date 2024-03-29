import { about } from "./about/about.command";
import { clear } from "./clear/clear.command";
import { info } from "./info/info.command";
import { join } from "./join/join.command";
import { loop } from "./loop/loop.command.js";
import { move } from "./move/move.command";
import { pause } from "./pause/pause.command.js";
import { play } from "./play/play.command.js";
import { queue } from "./queue/queue.command";
import { remove } from "./remove/remove.command";
import { resume } from "./resume/resume.command.js";
import { setdj } from "./setdj/setdj.command";
import { shuffle } from "./shuffle/shuffle.command.js";
import { skip } from "./skip/skip.command.js";
import { stop } from "./stop/stop.command.js";
import { shutdown } from "./shutdown/shutdown.command.js";

export const commands = [
	play,
	skip,
	shuffle,
	loop,
	stop,
	pause,
	resume,
	join,
	remove,
	queue,
	move,
	info,
	clear,
	about,
	setdj,
	shutdown
];