import { QueueItem } from "./QueueItem.model";
import { TrackType } from "./enums/TrackType.enum";

export interface TrackAdd {
	track: QueueItem;
	type: TrackType
}