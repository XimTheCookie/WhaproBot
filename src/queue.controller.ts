import { QueueItem } from "./models/QueueItem.model";
import { LoopMode } from "./models/enums/LoopMode.enum";
import { ArrayMove, ArrayRemove, ArrayShuffle } from "./utils/utils";

export class QueueController {
	private items: QueueItem[] = [];
	private np: QueueItem | undefined = undefined;
	private onPush: QueueItem | undefined = undefined;
	private mode: LoopMode = LoopMode.off;

	next(): QueueItem | undefined {
		if (this.mode === LoopMode.single && this.np) return this.np;
		if (this.onPush && this.mode !== LoopMode.off) this.items.push(this.onPush);
		this.np = this.items.shift();
		this.onPush = this.np;
		return this.np;
	}

	nowPlaying() {
		return this.np;
	}

	add(name: string, url: string, userId: string, thumbnailUrl: string) {
		this.items.push({ name, url, userId, thumbnailUrl });
	}

	remove(index: number): QueueItem | null {
		const item = ArrayRemove(this.items, index);
		if (item) return item;
		return null;
	}

	shuffle() {
		ArrayShuffle(this.items);
	}

	move(oldIndex: number, newIndex: number) {
		this.items = ArrayMove(this.items, oldIndex, newIndex);
	}

	setLoop(mode: LoopMode) {
		this.mode = mode;
	}

	getLoop() {
		return this.mode;
	}

	clear(uid?: string) {
		if (uid) {
			this.items = this.items.filter(i => i.userId !== uid);
			if (this.onPush?.userId === uid) this.onPush = undefined;
		} else {
			this.items = [];
			this.onPush = undefined;
		}
		
	}

	getQueue() {
		return this.items;
	}
}