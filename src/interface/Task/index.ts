// import { nanoid } from 'nanoid';
// import { checkNoRequestId, sendMessage } from '../Message';


// export type iTask = number;
// export enum Tasks {
// 	SetMode,
// 	UpdateMode,
// }

// function checkTask(task: number, message: object) {
// 	if (!(task in Tasks)) {
// 		throw new Error(`The property "task" must be registered in TASK Enumerated type.`);
// 	}
// 	if (message.hasOwnProperty('task')) {
// 		throw new Error(`The property "task" in the task message is a reserved attribute in request function.`);
// 	}
// }


// export function sendTaskMessage(task: iTask, message: object = {}, tabId?: number): void {
// 	checkTask(task, message);
// 	sendMessage({
// 		...message,
// 		task,
// 	}, tabId);
// }

// export async function requestTaskMessage(task: iTask, message: object = {}, tabId?: number): Promise<unknown> {
// 	return new Promise(resolve => {
// 		checkNoRequestId(message);
// 		checkTask(task, message);
// 		const requestId = nanoid();

// 		const receiveResponse = (message: { requestId: string, task: Task }) => {
// 			if ((message.requestId === requestId) && (message.task === task)) resolve(message);
// 			chrome.runtime.onMessage.removeListener(receiveResponse);
// 		}
// 		chrome.runtime.onMessage.addListener(receiveResponse);
// 		sendTaskMessage(task, message, tabId);
// 	});
// }