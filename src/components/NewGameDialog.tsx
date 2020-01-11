import React, { useState } from 'react';
import {
  Overlay,
  Dialog,
  Button,
  FlexColumn,
  FlexRow,
  ConfirmButton
} from './layout';
import { useStore } from '../store/createStore';

interface NewGameDialogProps {
  onClose?: () => void;
  show: boolean;
}

export const NewGameDialog: React.FunctionComponent<NewGameDialogProps> = ({
  onClose,
  show
}) => {
  const store = useStore();

  const [formData, setFormFieldData] = useState<{
    sentence: string | null;
    subject: string | null;
  }>({ sentence: null, subject: null });

  if (!show) return null;

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;

    setFormFieldData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData['sentence'] !== null && formData['subject'] !== null) {
      store.puzzle = formData['sentence'];
      store.puzzleSubject = formData['subject'];
      store.startNewRound();
    }

    if (onClose) onClose();
  };

  return (
    <Overlay>
      <Dialog style={{ maxWidth: 400 }}>
        <FlexColumn>
          <label htmlFor="sentence">Sentence</label>
          <input
            autoFocus
            name="sentence"
            onChange={handleChange}
            type="text"
          ></input>
          <label htmlFor="subject">Subject</label>
          <input name="subject" onChange={handleChange} type="text"></input>
          <FlexRow style={{ paddingTop: 16 }}>
            <ConfirmButton onClick={handleSubmit}>Done</ConfirmButton>
            <Button onClick={onClose}>Cancel</Button>
          </FlexRow>
        </FlexColumn>
      </Dialog>
    </Overlay>
  );
};
