/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';

// import { MODE, getMode } from '../interface/Mode';
// import { useChromeStorage } from './tools/Hook';
// import { MODE } from '../interface/Mode';
import Messenger, { Tabs } from '../interface/Messenger';

// import CalibrationRuler from './components/CalibrationRuler';
// import CursorMonitor from './components/CursorMonitor';
// import PointParser from './components/PointParser';


const App = () => {
	const [value, setValue] = useState(0);
	useEffect(() => {
		// Messenger.addListener((message) => {
		// 	console.log('listener', message);
		// 	return 'response from content';
		// })
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			console.log('content', message)
			sendResponse('response from content')
		})
	}, [])
	const send = async () => {
		// chrome.runtime.sendMessage('123', r => console.log(r));

		// console.log(Messenger.send('123', Tabs.Background))
		// console.log(await Messenger.request('123', Tabs.Background))

		// console.log(Messenger.send('123', 1115268935))
		console.log(await Messenger.request('123', 1115268935))

		// console.log(Messenger.send('123', Tabs.AllContents))
	}
	return (
		<>
			<input value={value} onChange={(event) => setValue(+event.target.value)} />
			<button onClick={() => send()}>send</button>
		</>
	)


	// const [mode, setMode] = useChromeStorage('mode', MODE.Null);
	// useEffect(() => {//
	// 	chrome.storage.local.set({
	// 		test: 1,
	// 	});
	// 	chrome.storage.local.get('test', (data) => {
	// 		console.log(data)
	// 	});
	// }, []);

	// const [modeComponent, setModeComponent] = useState(<></>);
	// useEffect(() => {
	// 	switch (await getMode()) {
	// 	case MODE.Null:
	// 	default:
	// 		modeComponent = <></>;
	// 		break;
	// 	}
	// }, []);


	// const modeComponents: Array<JSX.Element> = [
	// 	<></>,
	// 	<CalibrationRuler/>,
	// 	<CursorMonitor/>,
	// 	<PointParser/>,
	// ];
	// const [modeIndex, setModeIndex] = useState(0);
	// useEffect(() => {
	// 	const setShortcutKey = (event: KeyboardEvent) => {
	// 		if (event.altKey && (event.code === 'KeyA')) {
	// 			const difference = event.shiftKey? -1 : 1;
	// 			setModeIndex(index => ((index + difference + modeComponents.length) % modeComponents.length));
	// 		}
	// 	}
	// 	window.addEventListener('keydown', setShortcutKey);
	// 	return () => window.removeEventListener('keydown', setShortcutKey);
	// }, []);


	// return (
	// 	<>
	// 		{modeComponents[modeIndex]}
	// 	</>
	// );
}
export default App;