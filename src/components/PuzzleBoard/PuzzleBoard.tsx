import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import LetterTile from './LetterTile';
import { Letter } from '../../store/createStore';
import { useStore } from './../../store/store';

export const GRID_ROW_LENGTH = 14;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const PuzzleBoard: React.FunctionComponent = observer(() => {
  const store = useStore();
  const { puzzle, unlockedLetters, solvingIndex } = store;

  let puzzleRows: string[] = [];
  let row = '';
  puzzle.split(' ').forEach(word => {
    let rowWithWord = row + ' ' + word;

    if (rowWithWord.length > GRID_ROW_LENGTH) {
      puzzleRows.push(row);
      row = word;
      return;
    }

    row = rowWithWord;
  });

  puzzleRows.push(row);

  // Shift rows down one row if maximum three rows of text
  if (puzzleRows.length > 3) {
    puzzleRows = [' '.repeat(GRID_ROW_LENGTH), ...puzzleRows];
  }

  // Add fourth row if doesn't exist already
  if (puzzleRows.length < 4) {
    puzzleRows = [...puzzleRows, ' '.repeat(GRID_ROW_LENGTH)];
  }

  // Pad rows with text with empty tiles
  puzzleRows = puzzleRows.map(row => {
    const padding = GRID_ROW_LENGTH - row.length;
    if (padding > 1) {
      return ' '.repeat(padding / 2) + row + ' '.repeat(Math.ceil(padding / 2));
    }

    return row;
  });

  let letterIndex = 0;

  return (
    <Container>
      {puzzleRows.map(row =>
        row.split('').map((letter, index) => {
          // TODO: const thisIndex = letterIndex++;
          return (
            <LetterTile
              key={index}
              unlocked={unlockedLetters.has(letter as Letter)}
              character={letter as Letter}
              highlighted={letter !== ' ' && thisIndex === solvingIndex}
            />
          );
        })
      )}
    </Container>
  );
});
