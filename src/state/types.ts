import { vocals, consonants } from './constants';

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type Vocal = ElementType<typeof vocals>;
export type Consonant = ElementType<typeof consonants>;

export type Letter = Vocal | Consonant;

export enum Sector {
  BANKRUPT = 'bankrupt',
  LOSE_A_TURN = 'lose_a_turn',
  POINTS_5000 = 5000,
  POINTS_900 = 900,
  POINTS_800 = 800,
  POINTS_700 = 700,
  POINTS_650 = 650,
  POINTS_600 = 600,
  POINTS_550 = 550,
  POINTS_500 = 500
}
