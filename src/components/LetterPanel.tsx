import React, { FunctionComponent } from 'react';
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
    opacity: 0.3;
  }
`;

const HiddenKeyboardInputForSolveAttempt = styled.input`
  position: fixed;
  left: -99999px;
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
      {(isSolving || isVocalAvailable || isConsonantAvailable) && (
        <HiddenKeyboardInputForSolveAttempt
          autoFocus
          onInput={(e: React.FormEvent<HTMLInputElement>): void => {
            //alert('gottit');
            attemptLetter(e.currentTarget.value[0] as Letter);
            e.currentTarget.value = '';
            e.preventDefault();
          }}
        />
      )}
    </Panel>
  );
});
