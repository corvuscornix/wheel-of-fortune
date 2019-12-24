import './App.css';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import { LetterPanel, Players, Wheel, PuzzleBoard } from './components';
import { FlexColumn, FlexRow } from './components/layout';

const AppContainer = styled.div`
  margin: auto;
`;

const AppHeader = styled.header`
  background-color: #070799;
  padding: 20px;
  display: flex;
  color: white;
`;

const AppTitle = styled.span`
  font-size: 1.5em;
  flex-grow: 2;
`;

const AppMain = styled.main`
  max-width: 1000px;
`;

const App: FunctionComponent = observer(() => {
  const store = useStore();
  const { puzzle, unlockedLetters } = store;

  return (
    <AppContainer>
      <AppHeader>
        <AppTitle>Wheel of Fortune</AppTitle>
      </AppHeader>
      <AppMain>
        <FlexRow>
          <FlexRow>
            <Players />
          </FlexRow>
          <FlexColumn>
            <PuzzleBoard puzzle={puzzle} unlockedLetters={unlockedLetters} />
            <LetterPanel />
            <Wheel />
          </FlexColumn>
        </FlexRow>
      </AppMain>
    </AppContainer>
  );
});

export default App;
