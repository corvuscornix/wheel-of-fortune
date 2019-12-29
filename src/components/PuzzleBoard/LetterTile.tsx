import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Letter } from '../../store/createStore';

interface LetterTileProps {
  character: Letter | ' ';
  unlocked: boolean;
  highlighted: boolean;
}

const LetterTileElement = styled.div<{ background: string }>`
  width: calc(100% / 14 - 4px);
  height: 50px;
  line-height: 50px;
  border: 2px solid black;
  text-align: center;

  background: ${props => props.background};
`;

const LetterTile: FunctionComponent<LetterTileProps> = props => {
  const { character, unlocked, highlighted } = props;
  const isEmpty = character === ' ';
  let background = 'blue';

  if (unlocked) {
    background = 'white';
  } else if (highlighted) {
    background = 'yellow';
  } else if (!isEmpty) {
    background = 'lightgray';
  }

  return (
    <LetterTileElement background={background}>
      {unlocked && character}
    </LetterTileElement>
  );
};

export default LetterTile;
