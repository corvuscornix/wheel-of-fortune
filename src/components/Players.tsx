import React from 'react';
import styled from 'styled-components/macro';
import { useAppState } from '../state/stateContext';
import { observer } from 'mobx-react';

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
        <div
          key={player.name}
          style={{
            fontWeight: player === currentPlayer ? 'bold' : undefined
          }}
        >
          {`${player.name} ${player.points} pts (total: ${player.totalPoints})`}
          {editable && (
            <RemoveIconButton onClick={() => removePlayer(player.name)}>
              X
            </RemoveIconButton>
          )}
        </div>
      ))}
      {editTools}
    </Container>
  );
});
