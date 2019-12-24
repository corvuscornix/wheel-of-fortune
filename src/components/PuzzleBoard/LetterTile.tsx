import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface LetterTileProps {
  character: string; // Should be character type
  unlocked: boolean;
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
  const { character, unlocked } = props;
  const isEmpty = character === ' ';
  let background = 'blue';

  if (unlocked) {
    background = 'white';
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
