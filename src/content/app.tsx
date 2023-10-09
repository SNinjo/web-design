/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';

import CursorMonitor from './components/CursorMonitor';
import PointParser from './components/PointParser';
import CalibrationRuler from './components/CalibrationRuler';


const App = () => {
	const modeComponents: Array<JSX.Element> = [
		<></>,
		<CalibrationRuler/>,
		<CursorMonitor/>,
		<PointParser/>,
	];
	const [modeIndex, setModeIndex] = useState(0);
	useEffect(() => {
		const setShortcutKey = (event: KeyboardEvent) => {
			if (event.altKey && (event.code === 'KeyA')) {
				const difference = event.shiftKey? -1 : 1;
				setModeIndex(index => ((index + difference + modeComponents.length) % modeComponents.length));
			}
		}
		window.addEventListener('keydown', setShortcutKey);
		return () => window.removeEventListener('keydown', setShortcutKey);
	}, []);


	return (
		<>
			{modeComponents[modeIndex]}
		</>
	);
}
export default App;