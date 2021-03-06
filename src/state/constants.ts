export const vocals = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'] as const;
export const consonants = [
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'V',
  'W',
  'X',
  'Z'
] as const;

export const letters = new Set([...vocals, ...consonants]);

export const BUY_VOCAL_PRICE = 250;
export const REACTION_TIMEOUT = 15;
export const SOLVE_TIMEOUT = 40;
