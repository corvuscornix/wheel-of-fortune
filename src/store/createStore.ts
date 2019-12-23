type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

const vocals = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'] as const;
const consonants = [
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

export type Vocal = ElementType<typeof vocals>;
export type Consonant = ElementType<typeof consonants>;

export type Letter = Vocal | Consonant;

export type TStore = {
  puzzle: string;
  letterOptions: Set<Letter>;
  vocalOptions: Set<Letter>;
  unlockedLetters: Set<Letter>;
  isSpinning: boolean;
  spinResult: number | null;
};

export const createStore = (): TStore => {
  return {
    puzzle: 'Welcome to Wheel of Fortune'.toUpperCase(),
    letterOptions: new Set<Letter>([vocals, consonants].flat()),
    vocalOptions: new Set(vocals),
    unlockedLetters: new Set<Letter>(),
    isSpinning: false,
    spinResult: null
  };
};

//export type TStore = ReturnType<typeof createStore>;
