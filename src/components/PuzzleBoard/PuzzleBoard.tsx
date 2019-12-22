import React from 'react';
import styled from 'styled-components';
import { LetterTile } from './LetterTile';

export const GRID_ROW_LENGTH = 14;
const GRID_ROW_COUNT = 4;

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
`;

interface PuzzleBoardProps {
	puzzle: string;
	unlockedLetters: Set<string>;
}

interface PuzzleBoardState {
	puzzlePadded: string[];
}

export class PuzzleBoard extends React.Component<
	PuzzleBoardProps,
	PuzzleBoardState
> {
	constructor(props: PuzzleBoardProps) {
		super(props);

		let puzzlePadded = props.puzzle;
		const padding = GRID_ROW_LENGTH * GRID_ROW_COUNT - puzzlePadded.length;
		puzzlePadded =
			' '.repeat(padding / 2) + puzzlePadded + ' '.repeat(padding / 2);

		this.state = {
			puzzlePadded: puzzlePadded.split('')
		};
	}

	render() {
		const { unlockedLetters } = this.props;

		return (
			<Container>
				{this.state.puzzlePadded.map((letter, index) => (
					<LetterTile
						key={index}
						unlocked={unlockedLetters.has(letter)}
						character={letter}
					/>
				))}
			</Container>
		);
	}
}
