import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/macro';
import LetterTile from './LetterTile';
import { useAppState } from '../../state/stateContext';
import { Letter } from '../../state/types';
import { FlexColumn } from '../layout';
import { letters } from '../../state/constants';

export const GRID_ROW_LENGTH = 14;

const TilesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const PuzzleBoard: React.FunctionComponent = observer(() => {
  const store = useAppState();
  const {
    puzzle,
    unlockedLetters,
    solvingIndex,
    solveSentence,
    isGameOver,
    puzzleSubject
  } = store;

  const SubjectPanel = styled.div`
    margin: auto;
    font-size: 24px;
    margin-top: -16px;
    padding: 4px 16px;
    border-radius: 15px;
    background: blue;
    color: white;
    border: 1px solid white;
  `;

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
  if (puzzleRows.length < 3) {
    puzzleRows = [' '.repeat(GRID_ROW_LENGTH), ...puzzleRows];
  }

  // Add rows until we have 4 rows
  while (puzzleRows.length < 4) {
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
    <FlexColumn style={{ height: 'auto', overflow: 'unset' }}>
      <TilesContainer>
        {puzzleRows.map(row =>
          row.split('').map((letter, index) => {
            const isNotEmpty = letter !== ' ';
            const useSolveAttemptLetter = isNotEmpty && solvingIndex !== null;
            let thisLetterIndex = useSolveAttemptLetter
              ? letterIndex++
              : Infinity;

            return (
              <LetterTile
                key={index}
                unlocked={
                  isNotEmpty &&
                  (unlockedLetters.has(letter as Letter) ||
                    !letters.has(letter as Letter) ||
                    isGameOver ||
                    (useSolveAttemptLetter &&
                      solvingIndex !== null &&
                      thisLetterIndex < solvingIndex))
                }
                character={
                  solveSentence && useSolveAttemptLetter
                    ? solveSentence[thisLetterIndex]
                    : (letter as Letter)
                }
                highlighted={
                  useSolveAttemptLetter && thisLetterIndex === solvingIndex
                }
              />
            );
          })
        )}
      </TilesContainer>
      {puzzleSubject.length > 0 ? (
        <SubjectPanel>{puzzleSubject}</SubjectPanel>
      ) : null}
    </FlexColumn>
  );
});
