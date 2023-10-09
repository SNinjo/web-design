/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { Position, Size } from 'outward';




export function useScreen(): {
	screenSize: Size,
} {
	const [screenSize, setScreenSize] = useState(new Size(window.innerWidth, window.innerHeight));
	useEffect(() => {
		const updateScreenSize = () => setScreenSize(new Size(window.innerWidth, window.innerHeight));
		window.addEventListener('resize', updateScreenSize);
		return () => window.removeEventListener('resize', updateScreenSize);
	}, []);
	return {
		screenSize,
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