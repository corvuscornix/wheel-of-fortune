import { observable } from 'mobx';

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

const BUY_VOCAL_PRICE = 250;

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
  @observable name: string = '';
  @observable points = 0;
  @observable totalPoints = 0;

  constructor(name: string) {
    this.name = name;
  }
}

export type TStore = {
  puzzle: string;
  consonantOptions: Set<Consonant>;
  vocalOptions: Set<Vocal>;
  unlockedLetters: Set<Letter>;
  isSpinning: boolean;
  spinResult: Sector | null;
  players: Player[];
  currentPlayer: Player | null;
  addPlayer(name: string): void;
  removePlayer(name: string): void;
  changeTurn(): void;
  editingPlayers: boolean;
  attemptLetter(letter: Letter): void;
  handleSpinResult(sector: Sector): void;
  isVocalAvailable: boolean;
  isConsonantAvailable: boolean;
  announcementText: string;
  _userIndex: number;
};

export const createStore = (): TStore => {
  return {
    puzzle: 'Welcome to Wheel of Fortune'.toUpperCase(),
    consonantOptions: new Set<Consonant>(consonants),
    vocalOptions: new Set<Vocal>(vocals),
    unlockedLetters: new Set<Letter>(),
    isSpinning: false,
    spinResult: null,
    players: [new Player('Antero'), new Player('Amal')],
    editingPlayers: false,
    _userIndex: 0,
    announcementText: 'Welcome to Wheel of Fortune!',

    addPlayer(name: string): void {
      this.players.push(new Player(name));
    },

    removePlayer(name: string): void {
      this.players = this.players.filter(player => player.name !== name);
    },

    get currentPlayer(): Player {
      return this.players[this._userIndex % this.players.length];
    },

    handleSpinResult(result: Sector): void {
      this.isSpinning = false;

      if (this.currentPlayer === null)
        throw new Error('Current player shouldnt be null');
      switch (result) {
        case Sector.BANKRUPT:
          this.currentPlayer.points = 0;
          this.changeTurn();
          break;
        case Sector.LOSE_A_TURN:
          this.changeTurn();
          break;
        default:
          this.spinResult = result;
          this.announcementText = `${this.currentPlayer.name}, choose a letter. Vocals cost 250 points.`;
      }
    },

    changeTurn(): void {
      if (this.currentPlayer === null)
        throw new Error("Current player shouldn't be null");
      this._userIndex++;
      this.spinResult = null;
      this.announcementText = `${this.currentPlayer.name}'s turn!`;
    },

    attemptLetter(letter: Letter): void {
      if (this.currentPlayer === null)
        throw new Error("Current player shouldn't be null");

      const isVocal = vocals.indexOf(letter as Vocal) > -1;
      if (isVocal) {
        this.currentPlayer.points -= BUY_VOCAL_PRICE;
      }

      if (
        this.puzzle.indexOf(letter) > -1 &&
        !this.unlockedLetters.has(letter) &&
        typeof this.spinResult === 'number'
      ) {
        if (!isVocal) {
          this.currentPlayer.points += this.spinResult;
        }

        this.spinResult = null;
      } else {
        this.changeTurn();
      }

      this.unlockedLetters.add(letter);
    },

    get isVocalAvailable(): boolean {
      if (this.currentPlayer === null)
        throw new Error("Current player shouldn't be null");

      return (
        this.spinResult !== null &&
        this.players.length > 0 &&
        this.currentPlayer.points >= BUY_VOCAL_PRICE &&
        !this.isSpinning
      );
    },

    get isConsonantAvailable(): boolean {
      return this.spinResult !== null;
    }
  };
};

//export type TStore = ReturnType<typeof createStore>;
