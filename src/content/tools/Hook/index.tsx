/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { Position, Size } from 'outward';

import { sendMessage } from '../../../interface/Message';




export function useWindow(): {
	windowSize: Size,
} {
	const [windowSize, setWindowSize] = useState(new Size(window.innerWidth, window.innerHeight));
	useEffect(() => {
		const updateWindowSize = () => setWindowSize(new Size(window.innerWidth, window.innerHeight));
		window.addEventListener('resize', updateWindowSize);
		return () => window.removeEventListener('resize', updateWindowSize);
	}, []);
	return {
		windowSize,
	};
}




let cursorCurrentPosition = new Position();
window.addEventListener('mousemove', (event) => {
	cursorCurrentPosition = new Position(event.clientX, event.clientY);
});

export function useCursor(): {
	cursorPosition: Position,

	isLeftButtonPressed: boolean,
	leftButtonPressedPosition: Position | null,
	leftButtonReleasedPosition: Position | null,
} {
	const [cursorPosition, setCursorPosition] = useState(cursorCurrentPosition);

	const [isLeftButtonPressed, setLeftButtonPressedState] = useState(false);
	const [leftButtonPressedPosition, setLeftButtonPressedPosition] = useState(cursorPosition);
	const [leftButtonReleasedPosition, setLeftButtonReleasedPosition] = useState(cursorPosition);

	useEffect(() => {
		const updateCurrentPosition = () => setCursorPosition(cursorCurrentPosition);

		const pressLeftButton = (event: MouseEvent) => {
			if (event.button === 0) {
				setLeftButtonPressedState(true);
				setLeftButtonPressedPosition(new Position(event.clientX, event.clientY));
			}
		}
		const releaseLeftButton = (event: MouseEvent) => {
			if (event.button === 0) {
				setLeftButtonPressedState(false);
				setLeftButtonReleasedPosition(new Position(event.clientX, event.clientY));
			}
		}

		
		window.addEventListener('mousemove', updateCurrentPosition);
		window.addEventListener('mousedown', pressLeftButton);
		window.addEventListener('mouseup', releaseLeftButton);
		return () => {
			window.removeEventListener('mousemove', updateCurrentPosition);
			window.removeEventListener('mousedown', pressLeftButton);
			window.removeEventListener('mouseup', releaseLeftButton);
		}
	}, []);

	return {
		cursorPosition,

		isLeftButtonPressed,
		leftButtonPressedPosition,
		leftButtonReleasedPosition,
	};
}




export function useChromeStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
	const taskUpdateStorageValueToEachTab = `update chrome storage value with key "${key}" to each tab`;
	const [value, setValue] = useState(initialValue);
	const updateValue = async (value: T) => {
		await chrome.storage.local.set({ [key]: value });
		sendMessage({
			task: taskUpdateStorageValueToEachTab,
			value,
		});
	}

	useEffect(() => {
		chrome.storage.local.get(key, (storage) => setValue(storage[key]));

		const receivingUpdatingTaskMessage = (message: { task: string, value: T }) => {
			if (message.task === taskUpdateStorageValueToEachTab) setValue(message.value);
		}
		chrome.runtime.onMessage.addListener(receivingUpdatingTaskMessage);
		() => chrome.runtime.onMessage.removeListener(receivingUpdatingTaskMessage);
	}, []);
	return [value, updateValue];
}