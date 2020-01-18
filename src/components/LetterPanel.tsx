import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useAppState } from '../state/stateContext';
import { Panel } from './layout';
import { Letter } from '../state/types';

const ContainerDiv = styled.div`
  width: 100%;
  text-align: center;
  margin: 16px 0 16px 0;
`;

const LetterButton = styled.button<{ vocal?: boolean }>`
  width: 50px;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  ${props => props.vocal && 'background: yellow;'};

  :disabled {
    opacity: 0.2;
  }
`;

export const LetterPanel: FunctionComponent = observer(() => {
  const store = useAppState();
  const {
    consonantOptions,
    unlockedLetters,
    vocalOptions,
    isVocalAvailable,
    isConsonantAvailable,
    attemptLetter
  } = store;

  return (
    <Panel height="auto">
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
    </Panel>
  );
});
