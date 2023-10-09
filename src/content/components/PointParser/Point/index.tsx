import React, { FC } from 'react';
import { Position } from 'outward';

import { useScreen } from '../../../tools/Hook';
import style from './index.scss';


type iProps = {
	position: Position,
}
const Point: FC<iProps> = ({ position }) => {
	const { screenSize } = useScreen();

	const radius = 2.5;


	return (
		<div
			style={{
				left: 	(position.x - radius),
				top: 	(position.y - radius),
				width: 	(radius * 2),
				height: (radius * 2),

				justifyContent: ((screenSize.width - position.x) >= 100)? 'flex-start' : 'flex-end',
				alignItems: ((screenSize.height - position.y) >= 100)? 'flex-start' : 'flex-end',

				borderRadius: radius,
			}}
			className={style.div}
		>
			<span
				style={{
					padding: (radius * 2),
				}}
			>
				{`(${position.x}, ${position.y})`}
			</span>
		</div>
	)
}
export default Point;