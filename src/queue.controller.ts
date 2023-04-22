import { QueueItem } from "./models/QueueItem.model";
import { ArrayMove, ArrayRemove, ArrayShuffle } from "./utils/utils";

export class QueueController {
	private items: QueueItem[] = [];
	private np: QueueItem | undefined = undefined;
	private onPush: QueueItem | undefined = undefined;
	private loop: boolean = false;

	next(): QueueItem | undefined {
		if (this.onPush && this.loop) this.items.push(this.onPush);
		this.np = this.items.shift();
		this.onPush = this.np;
		return this.np;
	}

	nowPlaying() {
		return this.np;
	}

	add(name: string, url: string, userId: string) {
		this.items.push({ name, url, userId });
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

	switchLoop() {
		this.loop = !this.loop;
		return this.loop;
	}

	getLoop() {
		return this.loop;
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