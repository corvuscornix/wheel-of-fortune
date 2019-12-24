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

export class Player {
  constructor(public name: string, public points: number = 0) {}
}

export type TStore = {
  puzzle: string;
  consonantOptions: Set<Consonant>;
  vocalOptions: Set<Vocal>;
  unlockedLetters: Set<Letter>;
  isSpinning: boolean;
  spinResult: Sector | null;
  players: Player[];
  currentPlayer: number;
  addPlayer(name: string): void;
  removePlayer(name: string): void;
  goToNextPlayer(): void;
  editingPlayers: boolean;
  attemptLetter(letter: Letter): void;
  handleSpinResult(sector: Sector): void;
};

export const createStore = (): TStore => {
  return {
    puzzle: 'Welcome to Wheel of Fortune'.toUpperCase(),
    consonantOptions: new Set<Consonant>(consonants),
    vocalOptions: new Set<Vocal>(vocals),
    unlockedLetters: new Set<Letter>(),
    isSpinning: false,
    spinResult: null,
    players: [],
    currentPlayer: 0,
    editingPlayers: false,

    addPlayer(name: string) {
      this.players.push(new Player(name));
    },

    removePlayer(name: string) {
      this.players = this.players.filter(player => player.name !== name);
    },

    handleSpinResult(result: Sector) {
      console.log(result);
      switch (result) {
        case Sector.BANKRUPT:
          this.players[this.currentPlayer].points = 0;
          this.goToNextPlayer();
          break;
        case Sector.LOSE_A_TURN:
          this.goToNextPlayer();
          break;
        default:
          this.spinResult = result;
      }
    },

    goToNextPlayer(): void {
      this.currentPlayer += 1;
      this.spinResult = null;
    },

    attemptLetter(letter: Letter): void {
      if (
        this.puzzle.indexOf(letter) > -1 &&
        !this.unlockedLetters.has(letter) &&
        typeof this.spinResult === 'number'
      ) {
        this.players[this.currentPlayer].points += this.spinResult;
        console.log(
          `player earned ${this.spinResult} pts and now has total ${
            this.players[this.currentPlayer].points
          }`
        );
        this.spinResult = null;
      } else {
        this.goToNextPlayer();
      }

      this.unlockedLetters.add(letter);
    }
  };
};

//export type TStore = ReturnType<typeof createStore>;
