import React, { useEffect, useState } from 'react';
import { Position } from 'outward';

import { useCursor } from '../../tools/Hook';
import Point from './Point';
import Line from './Line';


const PointParser = () => {
	const { cursorPosition } = useCursor();

	const [pointPositions, setPointPositions] = useState<Array<Position>>([]);
	const addPoint = (position: Position) => setPointPositions(pointPositions => [...pointPositions, position]);
	const clearAllPoints = () => setPointPositions([]);

	const [linePositions, setLinePositions] = useState<Array<[Position, Position]>>([]);
	const addLine = (startPosition: Position, endPosition: Position) => setLinePositions(linePositions => [...linePositions, [startPosition, endPosition]]);
	const clearAllLines = () => setLinePositions([]);

	const [isPainting, setPaintingState] = useState(false);
	const [pressedPosition, setPressedPosition] = useState(new Position());
	useEffect(() => {
		const setShortcutKey = (event: KeyboardEvent) => {
			switch (event.code) {
			case 'KeyX':
				if (!isPainting && event.altKey && (event.type === 'keydown')) {
					event.preventDefault();

					addPoint(cursorPosition);
					setPressedPosition(cursorPosition);
					setPaintingState(true);
				} else if (event.type === 'keyup') {
					if (cursorPosition.getDistance(pressedPosition) > 10) {
						addPoint(cursorPosition);
						addLine(pressedPosition, cursorPosition);
					}
					setPaintingState(false);
				}
				break;

			case 'KeyZ':
				if (event.altKey) {
					clearAllPoints();
					clearAllLines();
				}
				break;
			}
		}
		window.addEventListener('keydown', setShortcutKey, { passive: false });
		window.addEventListener('keyup', setShortcutKey, { passive: false });
		return () => {
			window.removeEventListener('keydown', setShortcutKey);
			window.removeEventListener('keyup', setShortcutKey);
		}
	}, [cursorPosition, isPainting, pressedPosition]);


	return (
		<>
			{pointPositions.map((position, index) => (
				<Point
					key={`point${index}`}
					position={position}
				/>
			))}
			{linePositions.map((line, index) => (
				<Line
					key={`point${index}`}
					startPosition={line[0]}
					endPosition={line[1]}
				/>
			))}
			{(isPainting && (cursorPosition.getDistance(pressedPosition) > 10))?
				<Line
					startPosition={pressedPosition}
					endPosition={cursorPosition}
				/>:
				<></>
			}
		</>
	)
}
export default PointParser;