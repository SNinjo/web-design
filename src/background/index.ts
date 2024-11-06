import Messenger from '../interface/Messenger'
// Messenger.initialize();


Messenger.addListener((message) => {
	console.log('listener', message);
	return 'response from background';
});
// console.log(Messenger.send('123', Messenger.tabIdOfBackground));
// (async () => {
// 	console.log(await Messenger.request('123', Messenger.tabIdOfBackground));
// })();

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	console.log('background', message, sender)
// 	sendResponse('response from background')
// })


// import { initialize as initializeMessage } from '../interface/Message';
// import { initialize as initializeMode } from '../interface/Mode';


// initializeMessage();
// initializeMode();