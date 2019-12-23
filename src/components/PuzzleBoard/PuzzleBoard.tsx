import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import LetterTile from './LetterTile';
import { Letter } from '../../store/createStore';

export const GRID_ROW_LENGTH = 14;
const GRID_ROW_COUNT = 4;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

interface PuzzleBoardProps {
  puzzle: string;
  unlockedLetters: Set<Letter>;
}

export const PuzzleBoard: React.FunctionComponent<PuzzleBoardProps> = observer(
  props => {
    const { unlockedLetters, puzzle } = props;

    let puzzlePadded = puzzle;
    const padding = GRID_ROW_LENGTH * GRID_ROW_COUNT - puzzlePadded.length;
    puzzlePadded =
      ' '.repeat(padding / 2) +
      puzzlePadded +
      ' '.repeat(Math.ceil(padding / 2));

    return (
      <Container>
        {puzzlePadded.split('').map((letter, index) => (
          <LetterTile
            key={index}
            unlocked={unlockedLetters.has(letter as Letter)}
            character={letter}
          />
        ))}
      </Container>
    );
  }
);
