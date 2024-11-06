import { nanoid } from 'nanoid';

import { isBackground } from '../Extension';


export const backgroundTabId = 0;
export const taskSendingMessageToContent = 'send message to content';
export function sendMessage(message: object, tabId?: number): void {
	if (isBackground()) {
		if (tabId === backgroundTabId) {
			throw new Error(`Can't send messages between backgrounds.`);
		} else if (tabId) {
			chrome.tabs.sendMessage(tabId, message);
		} else {
			chrome.tabs.query({}, (tabs) => {
				tabs.forEach(tab => {
					chrome.tabs.sendMessage((tab.id as number), message);
				});
			});
		}
	} else {
		if (tabId === backgroundTabId) {
			chrome.runtime.sendMessage(message);
		} else {
			chrome.runtime.sendMessage({
				task: taskSendingMessageToContent,
				tabId,
				message,
			});
		}
	}
}
export function initialize() {
	if (isBackground()) {
		chrome.runtime.onMessage.addListener((request: {task: string, message: object, tabId?: number}) => {
			if (request.task === taskSendingMessageToContent) {
				sendMessage(request.message, request.tabId);
			}
		});
	}
}

export function checkNoRequestId(message: object) {
	if (message.hasOwnProperty('requestId')) {
		throw new Error(`The property "requestId" in the message is a reserved attribute in request function.`);
	}
}
export async function requestMessage(message: object, tabId?: number): Promise<unknown> {
	return new Promise(resolve => {
		checkNoRequestId(message);
		const requestId = nanoid();

		const receiveResponse = (message: { requestId: string }) => {
			if (message.requestId === requestId) {
				resolve(message);
			}
			chrome.runtime.onMessage.removeListener(receiveResponse);
		}
		chrome.runtime.onMessage.addListener(receiveResponse);
		sendMessage(message, tabId);
	});
}
export function responseMessage(message: object, requestedMessage: {requestId: string, tabId?: number}) {
	checkNoRequestId(message);
	sendMessage({
		...message,
		requestId: requestedMessage.requestId
	}, requestedMessage.tabId);
}