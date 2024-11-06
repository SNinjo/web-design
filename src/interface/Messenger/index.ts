import { nanoid } from 'nanoid';

import { isBackground } from '../Extension';


type SendResponse = (response?: unknown) => void;
type MessageListener = (message: unknown, sender: chrome.runtime.MessageSender, sendResponse: SendResponse) => void;
type MessageEventListener = (event: Event) => void;
export type MessageHandler = (message: unknown) => unknown | Promise<unknown>;

type Task = string;
enum Tasks {
	GettingTabId = 'get tab id',
	CheckingForListenerAddedToBackground = 'check for listener added to background',
	SendingMessageToContent = 'send message to content',
}

type TabId = number;
export enum Tabs {
	AllContents = -1,
	Background = -2,
	Popup = -3,
}

export class Tab {

}


export default class Messenger {
	private static sendBetweenBackground(message: unknown, hasResponse = false): Promise<unknown> {
		return new Promise(resolve => {
			const messageId = nanoid();

			if (hasResponse) {
				const receiveResponse = (event: Event) => {
					const messageEvent = event as MessageEvent;
					if ((messageId === messageEvent.data.messageId) && (messageEvent.data.hasOwnProperty('response'))) {
						serviceWorker.removeEventListener('message', receiveResponse);
						resolve(messageEvent.data.response);
					}
				}
				serviceWorker.addEventListener('message', receiveResponse);
			} else {
				resolve(undefined);
			}

			serviceWorker.dispatchEvent(new MessageEvent('message', 
				{data:{
					messageId,
					message,
					hasResponse,
				}}
			))
		});
	}
	private static broadcastToContents(message: unknown): void {
		chrome.tabs.query({}, (tabs) => {
			tabs.forEach(tab => {
				if (tab.url?.match(/^https?:\/\//)) {
					chrome.tabs.sendMessage((tab.id as number), message);
				}
			});
		});
	}
	private static async sendToContentByBackground(message: unknown, tabId: TabId, hasResponse = false): Promise<unknown> {
		return new Promise(async resolve => {
			if (hasResponse) {
				chrome.runtime.sendMessage({
					task: Tasks.SendingMessageToContent,
					tabId,
					message,
					hasResponse,
				}, (response) => resolve(response));
			} else {
				chrome.runtime.sendMessage({
					task: Tasks.SendingMessageToContent,
					tabId,
					message,
					hasResponse,
				});
				resolve(null);
			}
		});
	}
	private static async sendMessage(message: unknown, tabId: TabId, hasResponse = false): Promise<unknown> {
		return new Promise(async resolve => {
			if (isBackground()) {
				switch (tabId) {
				case Tabs.Background:
					return resolve(await this.sendBetweenBackground(message, hasResponse));
				
				case Tabs.AllContents:
					Messenger.broadcastToContents(message);
					return resolve(undefined);

				default:
					if (hasResponse) {
						chrome.tabs.sendMessage(tabId, message, (response) => resolve(response));
					} else {
						chrome.tabs.sendMessage(tabId, message);
						resolve(undefined);
					}
					return;
				}
			} else {
				switch (tabId) {
				case Tabs.Background:
					if (hasResponse) {
						chrome.runtime.sendMessage(message, (response) => resolve(response));
					} else {
						chrome.runtime.sendMessage(message);
						resolve(undefined);
					}
					return
				default:
					return resolve(await Messenger.sendToContentByBackground(message, tabId, hasResponse));
				}
			}
		});
	}
	static send(message: unknown, tabId: TabId): void {
		Messenger.sendMessage(message, tabId, false);
	}
	static async request(message: unknown, tabId: TabId): Promise<unknown> {
		return Messenger.sendMessage(message, tabId, true);
	}


	private static messageHandlers = new Map<MessageHandler, {
		messageListener: MessageListener,
		messageEventListener?: MessageEventListener,
	}>();

	private static isTask(message: unknown): boolean {
		return (
			(typeof message === 'object')
			&& (message != null)
			&& message.hasOwnProperty('task')
			&& Object.values(Tasks).map(task => `${task}`).includes((message as {task: Task}).task)
		);
	}
	static addListener(messageHandler: MessageHandler): void {
		const messageListener = (message: unknown, sender: chrome.runtime.MessageSender, sendResponse: SendResponse) => {
			if (!Messenger.isTask(message)) {
				(async () => {
					sendResponse(await messageHandler(message));
				})();
				return true;
			}
		}
		chrome.runtime.onMessage.addListener(messageListener);

		let messageEventListener;
		if (isBackground()) {
			messageEventListener = async (event: Event) => {
				const messageEvent = event as MessageEvent;
				if (messageEvent.data.messageId && messageEvent.data.hasOwnProperty('message')) {
					if (messageEvent.data.hasResponse) {
						serviceWorker.dispatchEvent(new MessageEvent('message',
							{data: {
								messageId: messageEvent.data.messageId,
								response: await messageHandler(messageEvent.data.message),
							}}
						));
					} else {
						messageHandler(messageEvent.data.message);
					}
				}
			}
			serviceWorker.addEventListener('message', messageEventListener);
		}

		Messenger.messageHandlers.set(messageHandler, {
			messageListener,
			messageEventListener,
		});
	}
	static removeListener(messageHandler: MessageHandler): void {
		if (Messenger.messageHandlers.has(messageHandler)) {
			const { messageListener, messageEventListener } = Messenger.messageHandlers.get(messageHandler)!;
			chrome.runtime.onMessage.removeListener(messageListener);
			if (messageEventListener) {
				serviceWorker.removeEventListener('message', messageEventListener);
			}
		}
	}


	private static isInitialized = false;

	private static setListenerToBackground(): void {
		chrome.runtime.onMessage.addListener((
			request: {task: Task, message: unknown, tabId: number, hasResponse: boolean},
			sender: chrome.runtime.MessageSender,
			sendResponse: SendResponse,
		) => {
			switch (request.task) {
			case Tasks.GettingTabId:
				// sendResponse(sender.tab?.id)
				return;

			case Tasks.CheckingForListenerAddedToBackground:
				sendResponse({task: Tasks.CheckingForListenerAddedToBackground});
				return;

			case Tasks.SendingMessageToContent:
				if (request.hasResponse) {
					(async () => {
						sendResponse(await Messenger.request(request.message, request.tabId as number));
					})();
				} else {
					Messenger.send(request.message, request.tabId);
				}
				return request.hasResponse;

			default:
				return;
			}
		});
	}
	private static hasListenerInBackground(): Promise<boolean> {
		return new Promise(async resolve => {
			const response = await Messenger.request(
				{task: Tasks.CheckingForListenerAddedToBackground},
				Tabs.Background
			);
			resolve(
				(typeof response === 'object')
				&& (response != null)
				&& response.hasOwnProperty('task')
				&& ((response as {task: Task}).task === Tasks.CheckingForListenerAddedToBackground)
			);
		});
	}
	static async initialize(): Promise<void> {
		if (!Messenger.isInitialized) {
			Messenger.isInitialized = true;

			if (isBackground()) {
				Messenger.setListenerToBackground();
			} else if (!await Messenger.hasListenerInBackground()) {
				// eslint-disable-next-line no-console
				console.warn(
					`Please initialize Messenger in background. \n>> Messenger.initialize();`
				);
			}
		}
	}
}
Messenger.initialize();