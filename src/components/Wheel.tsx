import styled from 'styled-components';
import React from 'react';
import { observer } from 'mobx-react';
import CenterAlign from './layout/CenterAlign';

const WheelImage = styled.div<{ isRotating: boolean }>`
	width: 500px;
	height: 500px;
	background: url('wheel.png');
	background-size: contain;
	animation: ${props =>
		props.isRotating ? 'rotate 2s infinite linear ' : 'none'});
`;

/**
 * Thanks to https://css-tricks.com/get-value-of-css-rotation-through-javascript/
 *
 * @param element
 */
function getRotation(element: Element) {
	const st = window.getComputedStyle(element, null);
	const tr =
		st.getPropertyValue('-webkit-transform') ||
		st.getPropertyValue('-moz-transform') ||
		st.getPropertyValue('-ms-transform') ||
		st.getPropertyValue('-o-transform') ||
		st.getPropertyValue('transform') ||
		'fail...';

	// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	let values = tr.split('(')[1];
	values = values.split(')')[0];
	const valuesSplit = values.split(',');
	const a = parseFloat(valuesSplit[0]);
	const b = parseFloat(valuesSplit[1]);
	const c = parseFloat(valuesSplit[2]);
	const d = parseFloat(valuesSplit[3]);

	var scale = Math.sqrt(a * a + b * b);

	// arc sin, convert from radians to degrees, round
	// DO NOT USE: see update below
	var sin = b / scale;
	return Math.round(Math.asin(sin) * (180 / Math.PI));
}

@observer
export class Wheel extends React.Component {
	state = { rotation: 0 };
	spin = () => {
		const randomSpinAmount = Math.random() * 360 * 5;
		let rotation = 0;
		const intervalId = setInterval(() => {
			rotation++;
			if (rotation > randomSpinAmount) {
				clearInterval(intervalId);
				return;
			}
			this.setState({ rotation });
		}, 10);
	};

	render() {
		console.log(this.props);
		return (
			<CenterAlign>
				<WheelImage isRotating={false} />
				<button onClick={this.spin}>Spin</button>
			</CenterAlign>
		);
	}
}
