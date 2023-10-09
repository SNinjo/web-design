import React, { FC, useEffect, useState } from 'react';
import Outward, { Position, Size } from 'outward';

import style from './index.scss';


function toString(number: number): string {
	return `${(number > 0)? '+' : ''}${number}`;
}


type iProps = {
	startPosition: Position,
	endPosition: Position,
}
const Point: FC<iProps> = ({ startPosition, endPosition }) => {
	(function rotateTextToForward() {
		const angle = endPosition.getAngle(startPosition);
		if (angle && (Math.abs(angle) > 90)) {
			const position = startPosition;
			startPosition = endPosition;
			endPosition = position;
		}
	}());


	const lineWidth = 1;
	const [outward, setOutward] = useState(new Outward());
	useEffect(() => {
		const outward = new Outward();
		const centerPosition = endPosition.getCenter(startPosition);
		const distance = endPosition.getDistance(startPosition);
		outward.angle = endPosition.getAngle(startPosition) ?? 0;
		outward.position = centerPosition.add(new Position((distance / 2), (lineWidth / 2)).multiply(-1));
		outward.size = new Size(distance, lineWidth);
		setOutward(outward);
	}, [startPosition, endPosition]);


	return (
		<div
			style={{
				left: 	outward.x,
				top: 	outward.y,
				width: 	outward.width,
				height: outward.height,

				transform: `rotate(${outward.angle}deg)`,
			}}
			className={style.div}
		>
			<span>
				{`${toString(endPosition.x - startPosition.x)}, ${toString(endPosition.y - startPosition.y)}`}
			</span>
		</div>
	)
}
export default Point;