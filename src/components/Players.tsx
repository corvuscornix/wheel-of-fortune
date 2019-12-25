import React from 'react';
import styled from 'styled-components';
import { useStore } from './../store/store';
import { observer } from 'mobx-react';

const Container = styled.div`
  width: 200px;
  background-color: #070799;
  color: white;
  padding-left: 16px;
`;

const RemoveButton = styled.button`
  background: inherit;
  color: inherit;
  font-weight: bold;
  border: none;
`;

export const Players: React.FunctionComponent<{}> = observer(() => {
  const store = useStore();
  const {
    players,
    addPlayer,
    removePlayer,
    currentPlayer,
    editingPlayers
  } = store;

  const handlePlayerInput = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && e.target instanceof HTMLInputElement) {
      addPlayer(e.target.value);
      e.target.value = '';
    }
  };

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
          {`${player.name}   ${player.points} pts`}
          {editingPlayers && (
            <RemoveButton onClick={() => removePlayer(player.name)}>
              X
            </RemoveButton>
          )}
        </div>
      ))}
      {editingPlayers && (
        <input
          type="text"
          autoFocus
          placeholder="Enter name"
          onKeyDown={handlePlayerInput}
        />
      )}
      <button onClick={() => (store.editingPlayers = !store.editingPlayers)}>
        {store.editingPlayers ? 'Done' : 'Edit players'}
      </button>
    </Container>
  );
});
