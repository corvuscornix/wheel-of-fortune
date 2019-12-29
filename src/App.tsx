import './App.css';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import { LetterPanel, Players, Wheel, PuzzleBoard } from './components';
import { FlexColumn, FlexRow } from './components/layout';

const Container = styled.div`
  margin: auto;
  height: 100%;
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
  height: 100%;
`;

const AnnouncementText = styled.div`
  text-align: center;
  font-size: 16px;
  padding: 8px;
`;

const App: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <Container>
      <AppMain>
        <FlexRow>
          <FlexRow>
            <Players />
          </FlexRow>
          <FlexColumn grow="2">
            <PuzzleBoard />
            <AnnouncementText>{store.announcementText}</AnnouncementText>
            {store.canSolve && (
              <button onClick={store.attemptSolve}>Solve</button>
            )}
            {(store.isConsonantAvailable || store.solvingIndex !== null) && (
              <LetterPanel />
            )}
            <Wheel />
          </FlexColumn>
        </FlexRow>
      </AppMain>
    </Container>
  );
});

export default App;
