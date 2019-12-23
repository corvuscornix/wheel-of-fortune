import './App.css';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { PuzzleBoard } from './components/PuzzleBoard/PuzzleBoard';
import { Wheel } from './components/Wheel';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import { LetterPanel } from './components/LetterPanel';

const AppContainer = styled.div`
  text-align: center;
  max-width: 1000px;
  margin: auto;
`;

const AppHeader = styled.header`
  background-color: #222;
  height: 50px;
  padding: 20px;
  color: white;
`;

const AppTitle = styled.h1`
  font-size: 1.5em;
`;

const App: FunctionComponent = observer(() => {
  const store = useStore();
  const { puzzle, unlockedLetters } = store;
  console.log(puzzle);
  return (
    <AppContainer>
      <PuzzleBoard puzzle={puzzle} unlockedLetters={unlockedLetters} />
      <LetterPanel />
      <Wheel />
    </AppContainer>
  );
});

export default App;
