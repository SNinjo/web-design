// import { isBackground } from '../Extension';
// import Messenger from '../Messenger';


// type EventName = string;
// export class Event {
// 	name: EventName;
// 	message: unknown;

// 	constructor(name: EventName, message: unknown) {
// 		this.name = name;
// 		this.message = message;
// 	}
// }

// export type EventHandler = (event: Event) => unknown;
// export default class EventProcessor {
// 	private static eventHandlers = new Map<EventName, Set<EventHandler>>();


// 	static dispatch(event: Event) {
// 		Messenger.send(event, Messenger.tabIdOfBackground);
// 	}

// 	static addListener(eventName: EventName, eventHandler: EventHandler) {

// 	}
// 	static removeListener(eventName: EventName, eventHandler: EventHandler) {
	
// 	}
// }