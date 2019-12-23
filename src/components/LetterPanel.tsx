import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from './../store/store';
import { Letter } from '../store/createStore';

const ContainerDiv = styled.div`
  width: 100%;
  margin: 16px 0 16px 0;
`;

const LetterButton = styled.button<{ vocal: boolean }>`
  width: 40px;
  height: 40px;
  ${props => props.vocal && 'background: yellow;'};

  :disabled {
    background: lightgray;
  }
`;

export const LetterPanel: FunctionComponent = observer(() => {
  const store = useStore();
  const { letterOptions, unlockedLetters, vocalOptions } = store;

  return (
    <ContainerDiv>
      {Array.from(letterOptions).map(letter => (
        <LetterButton
          key={letter}
          onClick={() => store.unlockedLetters.add(letter)}
          disabled={unlockedLetters.has(letter)}
          vocal={vocalOptions.has(letter)}
        >
          {letter}
        </LetterButton>
      ))}
    </ContainerDiv>
  );
});
