import styled from 'styled-components';
import React from 'react';
import CenterAlign from './layout/CenterAlign';

const WheelImage = styled.div`
	width: 500px;
	height: 500px;
	background: url('wheel.png');
	background-size: contain;
`;

export class Wheel extends React.Component {
	render() {
		return (
			<CenterAlign>
				<WheelImage />
			</CenterAlign>
		);
	}
}
