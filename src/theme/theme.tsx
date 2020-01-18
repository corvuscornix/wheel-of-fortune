// Theme.tsx
import baseStyled, { ThemedStyledInterface } from 'styled-components';

export const theme = {
  color: {
    background: '#070799',
    confirm: '#8bc34a',
    alarm: '#ff5722',
    defaultText: 'white'
  }
};

export type Theme = typeof theme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;
