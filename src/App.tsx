import './App.css';
import React, { FunctionComponent } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useAppState } from './state/stateContext';
import {
  LetterPanel,
  Players,
  Wheel,
  PuzzleBoard,
  NewGameDialog
} from './components';
import {
  FlexColumn,
  FlexRow,
  Panel,
  Button,
  ConfirmButton,
  AlarmButton
} from './components/layout';

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
  const appState = useAppState();

  return (
    <ThemeProvider theme={theme}>
      <AppMain>
        <FlexColumn>
          <AnnouncementText>{appState.announcementText}</AnnouncementText>
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
                {appState.canSolve && !appState.isSolving && (
                  <ConfirmButton onClick={appState.attemptSolve}>
                    Solve
                  </ConfirmButton>
                )}
                {appState.isTimeTicking && (
                  <AlarmButton
                    onClick={() =>
                      appState.changeTurn(
                        `${
                          appState.currentPlayer
                            ? appState.currentPlayer.name
                            : ''
                        } skipped.`
                      )
                    }
                  >
                    Skip turn
                  </AlarmButton>
                )}
              </Panel>
              <Players />
              <RemainingTime timeLow={appState.remainingTime < 5}>
                {appState.isTimeTicking
                  ? `Thinking time left: ${appState.remainingTime} sec`
                  : null}
              </RemainingTime>
              <Button onClick={() => (appState.isEditingGame = true)}>
                New game
              </Button>
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
        <NewGameDialog />
      </AppMain>
    </ThemeProvider>
  );
});

export default App;
