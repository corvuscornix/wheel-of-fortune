import React from 'react';
import { keyframes } from 'styled-components/macro';
import { useAppState } from '../state/stateContext';
import { observer } from 'mobx-react';
import { styled } from '../theme/theme';

const Container = styled.div`
  width: 200px;
  background-color: #070799;
  color: white;
  flex-grow: 2;
`;

const RemoveIconButton = styled.button`
  background: inherit;
  color: inherit;
  font-weight: bold;
  border: none;
`;

const Name = styled.div<{ selected?: boolean }>`
  font-size: 18px;
  transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${({ selected, theme }) => {
    if (selected) {
      return `
        font-weight: bold;
        font-size: 20px;
        color: ${theme.color.confirm};
      `;
    }
  }}
`;

export const Players: React.FunctionComponent<{
  editable?: boolean;
}> = observer(({ editable }) => {
  const store = useAppState();
  const { players, addPlayer, removePlayer, currentPlayer } = store;

  const handlePlayerInput = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && e.target instanceof HTMLInputElement) {
      addPlayer(e.target.value);
      e.target.value = '';
    }
  };

  let editTools = [];

  if (editable) {
    editTools.push(
      <input
        key="name"
        type="text"
        autoFocus
        placeholder="Enter name"
        onKeyDown={handlePlayerInput}
      />
    );
  }

  return (
    <Container>
      <p>Players:</p>
      {players.map((player, index) => (
        <Name
          key={player.name}
          selected={!editable && player === currentPlayer}
        >
          {`${player.name} ${player.points} pts (total: ${player.totalPoints})`}
          {editable && (
            <RemoveIconButton onClick={() => removePlayer(player.name)}>
              X
            </RemoveIconButton>
          )}
        </Name>
      ))}
      {editTools}
    </Container>
  );
});
