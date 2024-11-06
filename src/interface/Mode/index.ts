// import { isBackground } from '../Extension';
// import { TASK, iTask, sendTaskMessage } from '../Task';


// export type iMode = string;
// export enum MODE {
// 	Null = 'null',
// 	CalibrationRuler = 'CalibrationRuler',
// 	CursorMonitor = 'CursorMonitor',
// 	PointParser = 'PointParser',
// }


// export function updateModeToEachTab() {
// 	if (isBackground()) {
// 		chrome.tabs.query({}, (tabs) => {
// 			tabs.forEach(tab => {
// 				chrome.tabs.sendMessage((tab.id as number), {
// 					task: TASK.UpdateMode,
// 				});
// 			});
// 		});
// 	} else {
// 		sendTaskMessage(TASK.UpdateMode);
// 	}
// }
// export function initialize() {
// 	if (isBackground()) {
// 		chrome.runtime.onMessage.addListener((message: {task: iTask}) => {
// 			if (message.task === TASK.UpdateMode) {
// 				updateModeToEachTab();
// 			}
// 		});
// 	}
// }

// export async function getMode(): Promise<iMode> {
// 	return new Promise(resolve => {
// 		chrome.storage.local.get('mode', ({ mode }) => {
// 			resolve(mode ?? MODE.Null);
// 		});
// 	})
// }
// export function setMode(mode: string) {
// 	chrome.storage.local.set({ mode }, () => {
// 		updateModeToEachTab();
// 	});
// }