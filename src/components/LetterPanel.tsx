import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from './../store/store';
import { CenterAlign } from './layout';

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
    isVocalAvailable,
    isConsonantAvailable,
    attemptLetter
  } = store;

  return (
    <CenterAlign>
      <ContainerDiv>
        <div>
          {Array.from(vocalOptions).map(letter => (
            <LetterButton
              key={letter}
              onClick={() => attemptLetter(letter)}
              disabled={!isVocalAvailable || unlockedLetters.has(letter)}
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
              disabled={!isConsonantAvailable || unlockedLetters.has(letter)}
            >
              {letter}
            </LetterButton>
          ))}
        </div>
      </ContainerDiv>
    </CenterAlign>
  );
});
