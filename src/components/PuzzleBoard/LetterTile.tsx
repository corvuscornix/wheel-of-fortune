import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';
import { Letter } from '../../state/types';

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
  font-size: 32px;
  font-weight: bold;
  background: ${props => props.background};
`;

const LetterTile: FunctionComponent<LetterTileProps> = props => {
  const { character, unlocked, highlighted } = props;
  const isEmpty = character === ' ';
  let background = 'blue';

  if (!isEmpty) {
    if (unlocked) {
      background = 'white';
    } else if (highlighted) {
      background = 'yellow';
    } else {
      background = 'lightgray';
    }
  }

  return (
    <LetterTileElement background={background}>
      {unlocked && character}
    </LetterTileElement>
  );
};

export default LetterTile;
