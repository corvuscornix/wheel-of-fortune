import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from './../store/store';
import { CenterAlign } from './layout';

const BUY_VOCAL_PRICE = 250;

const ContainerDiv = styled.div`
  width: 100%;
  text-align: center;
  margin: 16px 0 16px 0;
`;

const LetterButton = styled.button<{ vocal?: boolean }>`
  width: 40px;
  height: 40px;
  ${props => props.vocal && 'background: yellow;'};

  :disabled {
    background: lightgray;
  }
`;

export const LetterPanel: FunctionComponent = observer(() => {
  const store = useStore();
  const {
    consonantOptions,
    unlockedLetters,
    vocalOptions,
    players,
    currentPlayer,
    attemptLetter,
    spinResult
  } = store;

  return (
    <CenterAlign>
      <ContainerDiv>
        <div>
          {Array.from(vocalOptions).map(letter => (
            <LetterButton
              key={letter}
              onClick={() => attemptLetter(letter)}
              disabled={
                !spinResult ||
                unlockedLetters.has(letter) ||
                players[currentPlayer].points < BUY_VOCAL_PRICE
              }
              vocal={true}
            >
              {letter}
            </LetterButton>
          ))}
        </div>
        <div>
          {Array.from(consonantOptions).map(letter => (
            <LetterButton
              key={letter}
              onClick={() => attemptLetter(letter)}
              disabled={!spinResult || unlockedLetters.has(letter)}
            >
              {letter}
            </LetterButton>
          ))}
        </div>
      </ContainerDiv>
    </CenterAlign>
  );
});
