import './App.css';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components/macro';
import { observer } from 'mobx-react';
import { useStore } from './store/createStore';
import { LetterPanel, Players, Wheel, PuzzleBoard } from './components';
import { FlexColumn, FlexRow, Panel } from './components/layout';

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
      ? `color: #ff5722;
    font-weight: bold;
    `
      : `color: white;
    `}
`;

const App: FunctionComponent = observer(() => {
  const store = useStore();
  return (
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
                <button onClick={store.attemptSolve}>Solve</button>
              )}
              {!store.isSpinning && (
                <button
                  onClick={() =>
                    store.changeTurn(
                      `${
                        store.currentPlayer ? store.currentPlayer.name : ''
                      } skipped.`
                    )
                  }
                >
                  Skip turn
                </button>
              )}
            </Panel>
            <Players />
            <RemainingTime timeLow={store.remainingTime < 5}>
              {store.isTimeTicking
                ? `Thinking time left: ${store.remainingTime} sec`
                : null}
            </RemainingTime>
            <button onClick={store.startNewRound}>New round</button>
          </FlexColumn>
        </FlexRow>
      </FlexColumn>
    </AppMain>
  );
});

export default App;
