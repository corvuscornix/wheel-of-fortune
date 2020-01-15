import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Overlay,
  Dialog,
  Button,
  FlexColumn,
  FlexRow,
  SmallButton
} from './layout';
import { useAppState } from '../state/stateContext';
import { Players } from '.';
import { Puzzle } from '../state/state';

export const NewGameDialog: React.FunctionComponent = observer(() => {
  const appState = useAppState();
  const { isEditingGame, clearTicking, startNewGame } = appState;

  const [formData, setFormFieldData] = useState<{
    sentence: string;
    subject: string;
    puzzles: Puzzle[];
  }>({ sentence: '', subject: '', puzzles: [] });

  const { sentence, subject, puzzles } = formData;

  if (!isEditingGame) return null;

  clearTicking();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    setFormFieldData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    if (sentence.length > 0) {
      puzzles.push({
        sentence,
        subject
      });

      setFormFieldData({
        sentence: '',
        subject: '',
        puzzles
      });
    }
  };

  const handleClearPuzzles = () => {
    setFormFieldData({
      sentence: '',
      subject: '',
      puzzles: []
    });
  };

  const handleSubmit = () => {
    appState.puzzles = puzzles;
    appState.isEditingGame = false;
    startNewGame();
  };

  return (
    <Overlay>
      <Dialog style={{ maxWidth: 400 }}>
        <FlexColumn>
          {puzzles.map((puzzle, index) => (
            <p key={index}>{`${index + 1}. ${puzzle.sentence} (${
              puzzle.subject
            })`}</p>
          ))}
          <label htmlFor="sentence">Sentence</label>
          <input
            autoFocus
            autoComplete="off"
            name="sentence"
            onChange={handleChange}
            value={sentence}
            type="text"
          ></input>
          <label htmlFor="subject">Subject</label>
          <input
            name="subject"
            autoComplete="off"
            onChange={handleChange}
            value={subject}
            type="text"
          ></input>
          <FlexRow>
            <SmallButton onClick={handleAdd}>Add</SmallButton>
            <SmallButton negative onClick={handleClearPuzzles}>
              Clear all
            </SmallButton>
          </FlexRow>

          <Players editable />
          <FlexRow style={{ paddingTop: 16 }}>
            <Button positive onClick={handleSubmit}>
              Start game
            </Button>
            <Button onClick={() => (appState.isEditingGame = false)}>
              Cancel
            </Button>
          </FlexRow>
        </FlexColumn>
      </Dialog>
    </Overlay>
  );
});
