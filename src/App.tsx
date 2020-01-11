import './App.css';
import React, { FunctionComponent, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useStore } from './store/createStore';
import { LetterPanel, Players, Wheel, PuzzleBoard } from './components';
import {
  FlexColumn,
  FlexRow,
  Panel,
  Button,
  ConfirmButton,
  AlarmButton
} from './components/layout';
import { NewGameDialog } from './components/NewGameDialog';

const theme = {
  colorBg: '#070799',
  colorConfirm: '#8bc34a',
  colorAlarm: '#ff5722'
};

const AppMain = styled.main`
  max-width: 1000px;
  height: 100%;
  margin: auto;
`;

const AnnouncementText = styled.div`
  text-align: center;
  font-size: 16px;
  padding: 8px;
  color: white;
`;

const RemainingTime = styled.div<{ timeLow: boolean }>`
  margin-bottom: 16px;
  ${props =>
    props.timeLow
      ? `color: ${props.theme.colorAlarm};
    font-weight: bold;
    `
      : `color: white;
    `}
`;

const App: FunctionComponent = observer(() => {
  const store = useStore();
  const [isNewGameDialogOpen, showNewGameDialog] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AppMain>
        <FlexColumn>
          <AnnouncementText>{store.announcementText}</AnnouncementText>
          <PuzzleBoard />
          <LetterPanel />
          <FlexRow grow="2">
            <FlexColumn grow="2">
              <FlexRow grow="2">
                <Wheel />
              </FlexRow>
            </FlexColumn>
            <FlexColumn>
              <Panel height="auto">
                {store.canSolve && !store.isSolving && (
                  <ConfirmButton onClick={store.attemptSolve}>
                    Solve
                  </ConfirmButton>
                )}
                {store.isTimeTicking && (
                  <AlarmButton
                    background="#ff5722"
                    onClick={() =>
                      store.changeTurn(
                        `${
                          store.currentPlayer ? store.currentPlayer.name : ''
                        } skipped.`
                      )
                    }
                  >
                    Skip turn
                  </AlarmButton>
                )}
              </Panel>
              <Players />
              <RemainingTime timeLow={store.remainingTime < 5}>
                {store.isTimeTicking
                  ? `Thinking time left: ${store.remainingTime} sec`
                  : null}
              </RemainingTime>
              <Button onClick={() => showNewGameDialog(true)}>New round</Button>
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
        <NewGameDialog
          onClose={() => showNewGameDialog(false)}
          show={isNewGameDialogOpen}
        />
      </AppMain>
    </ThemeProvider>
  );
});

export default App;
