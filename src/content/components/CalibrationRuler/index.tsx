import React from 'react';
import { Position } from 'outward';

import { useCursor, useScreen } from '../../tools/Hook';
import style from './index.scss';


const CalibrationRuler = () => {
	const { screenSize } = useScreen();
	const { cursorPosition } = useCursor();

	const widthLine = 1;
	

	return (
		<div
			style={{
				display: (cursorPosition.equal(new Position(0, 0))? 'none' : 'block')
			}}
			className={style.div}
		>
			<div
				style={{
					left: 	0,
					top: 	cursorPosition.y,
					width: 	screenSize.width,
					height: widthLine,

					display: 'flex',
					alignItems: ((screenSize.height - cursorPosition.y) >= 40)? 'flex-start' : 'flex-end',
					justifyContent: 'center',
				}}
			/>
			<div
				style={{
					left: 	cursorPosition.x,
					top: 	0,
					width: 	widthLine,
					height: screenSize.height,

					display: 'flex',
					alignItems: 'center',
					justifyContent: ((screenSize.width - cursorPosition.x) >= 80)? 'flex-start' : 'flex-end',
				}}
			/>
		</div>
	)
}
export default CalibrationRuler;