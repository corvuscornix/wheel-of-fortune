import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useStore } from '../store/createStore';
import { CenterAlign, Panel } from './layout';
import { Letter } from '../store/types';

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
    opacity: 0.2;
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
    attemptLetter,
    isSolving
  } = store;

  useEffect(() => {
    // Hijack any keypress when in certain state
    document.onkeypress = function(e) {
      if (isSolving || isVocalAvailable || isConsonantAvailable) {
        e = e || window.event;
        attemptLetter(e.key as Letter);
      }
    };

    return () => {
      document.onkeypress = null;
    };
  });

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
