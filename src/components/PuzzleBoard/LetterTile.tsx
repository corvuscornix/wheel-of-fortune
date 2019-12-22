import React from 'react';
import styled from 'styled-components';

interface LetterTileProps {
	character: string; // Should be character type
	unlocked: boolean;
}

const LetterTileElement = styled.div<{ unlocked: boolean }>`
	width: calc(100% / 14 - 4px);
	height: 50px;
	line-height: 50px;
	border: 2px solid black;

	background: ${props => (props.unlocked ? 'white' : 'blue')};
`;

export class LetterTile extends React.Component<LetterTileProps> {
	constructor(props: LetterTileProps) {
		super(props);
	}

	render() {
		const { character, unlocked } = this.props;

		return (
			<LetterTileElement unlocked={unlocked}>{character}</LetterTileElement>
		);
	}
}
