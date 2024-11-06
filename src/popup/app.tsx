import React, { useEffect } from 'react';

// import Messenger from '../interface/Messenger';


const App = () => {
	useEffect(() => {
		console.log('enter popup')//
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			console.log('popup', message)
			// sendResponse('response from popup')
		})
	}, []);
	const send = () => {
		// chrome.tabs.sendMessage(1115268803, '123', r => console.log(r));
		chrome.runtime.sendMessage('123', r => console.log(r));
	}

	return (
		<>
			<button onClick={send}>send</button>
		</>
	);
}
export default App;