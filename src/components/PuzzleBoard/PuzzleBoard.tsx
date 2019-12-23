import React from 'react';
import { observer } from 'mobx-react';
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

interface PuzzleBoardState {}

@observer
export class PuzzleBoard extends React.Component<
	PuzzleBoardProps,
	PuzzleBoardState
> {
	constructor(props: PuzzleBoardProps) {
		super(props);
	}

	render() {
		const { unlockedLetters, puzzle } = this.props;

		let puzzlePadded = puzzle;
		const padding = GRID_ROW_LENGTH * GRID_ROW_COUNT - puzzlePadded.length;
		puzzlePadded =
			' '.repeat(padding / 2) + puzzlePadded + ' '.repeat(padding / 2);

		return (
			<Container>
				{puzzlePadded.split('').map((letter, index) => (
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
