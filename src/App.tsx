import './App.css';
import React, { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useAppState } from './state/stateContext';
import {
  LetterPanel,
  Players,
  Wheel,
  PuzzleBoard,
  NewGameDialog
} from './components';
import { FlexColumn, FlexRow, Panel, Button } from './components/layout';
import { theme, styled } from './theme/theme';
import { AnnouncementType } from './state/types';

const AppMain = styled.main`
  max-width: 1000px;
  height: 100%;
  margin: auto;
`;

const AnnouncementText = styled.div<{ type?: AnnouncementType }>`
  text-align: center;
  font-size: 24px;
  padding: 8px;
  color: ${({ type, theme }) => {
    switch (type) {
      case AnnouncementType.POSITIVE:
        return theme.color.confirm;
      case AnnouncementType.NEGATIVE:
        return theme.color.alarm;
      default:
        return 'white';
    }
  }};
`;

const RemainingTime = styled.div<{ timeLow: boolean }>`
  margin-bottom: 16px;
  ${props =>
    props.timeLow
      ? `color: ${props.theme.color.alarm};
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
          <AnnouncementText type={appState.announcement?.type}>
            {appState.announcement?.message}
          </AnnouncementText>
          <PuzzleBoard />
          <LetterPanel />
          <FlexRow grow="2">
            <FlexColumn>
              <Panel height="auto">
                {appState.canSolve && !appState.isSolving && (
                  <Button positive onClick={appState.attemptSolve}>
                    Solve
                  </Button>
                )}
                {appState.isTimeTicking && (
                  <Button
                    negative
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
                  </Button>
                )}
              </Panel>
              <Players />
              <RemainingTime timeLow={appState.remainingTime < 5}>
                {appState.isTimeTicking
                  ? `Thinking time left: ${appState.remainingTime} sec`
                  : null}
              </RemainingTime>
              {appState.isGameOver && appState.isNewRoundAvailable && (
                <Button positive onClick={appState.startNewRound}>
                  Start next round
                </Button>
              )}
              <Button onClick={() => (appState.isEditingGame = true)}>
                New game
              </Button>
            </FlexColumn>
            <FlexColumn grow="2">
              <FlexRow grow="2">
                <Wheel />
              </FlexRow>
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
        <NewGameDialog />
      </AppMain>
    </ThemeProvider>
  );
});

export default App;
