import { observable } from 'mobx';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
  editingPlayers: boolean;
  isVocalAvailable: boolean;
  isConsonantAvailable: boolean;
  announcementText: string;
  solvingIndex: number | null;
  solveSentence: Letter[] | null;
  canSolve: boolean;
  _userIndex: number;
  addPlayer(name: string): void;
  removePlayer(name: string): void;
  changeTurn(): void;
  attemptLetter(letter: Letter): void;
  handleSpinResult(sector: Sector): void;
  attemptSolve(): void;
};

function getSolvingIndex({
  solveSentence,
  solvingIndex,
  unlockedLetters
}: TStore): number | null {
  if (!solveSentence) {
    throw Error('Cannot get solving index when solving sentence is null');
  }

  for (
    let i = solvingIndex !== null ? solvingIndex + 1 : 0;
    i < solveSentence.length;
    i++
  ) {
    const letter = solveSentence[i];
    if (!unlockedLetters.has(letter as Letter)) {
      return i;
    }
  }

  return null;
}

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
    solvingIndex: null,
    solveSentence: null,

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
        throw new Error(
          'currentPlayer state shouldnt be null when handleSpinResult is called'
        );
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
          this.announcementText = `${
            this.currentPlayer.name
          }, you span ${this.spinResult.toString()}! Choose a letter. Vocals cost 250 points.`;
      }
    },

    changeTurn(): void {
      if (this.currentPlayer === null)
        throw new Error(
          "currentPlayer state shouldn't be null when changeTurn is called"
        );
      this._userIndex++;
      this.spinResult = null;
      this.solveSentence = null;
      this.solvingIndex = null;
      this.announcementText = `${this.currentPlayer.name}'s turn!`;
    },

    /**
     * Used in normal and solve attempts
     * @param letter
     */
    attemptLetter(letter: Letter): void {
      if (this.currentPlayer === null) {
        throw new Error(
          "currentPlayer state shouldn't be null during letter attempt"
        );
      }

      if (this.solvingIndex !== null && this.solveSentence !== null) {
        this.solveSentence[this.solvingIndex] = letter;
        this.solvingIndex = getSolvingIndex(this);

        // Last letter of solve attempt was entered, check whether the attempt is
        if (this.solvingIndex === null) {
          if (this.solveSentence.join('') === this.puzzle.replace(/\s/g, '')) {
            this.announcementText = `Player ${this.currentPlayer.name} has won the round!`;
            this.currentPlayer.totalPoints += this.currentPlayer.points;
          } else {
            this.changeTurn();
          }

          this.solveSentence = null;
        }
        return;
      }

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

        this.announcementText = `Letter '${letter}' appears ${
          (this.puzzle.match(new RegExp(letter, 'g')) || []).length
        } times! Spin again or try to solve.`;
      } else {
        this.changeTurn();
      }

      this.unlockedLetters.add(letter);
    },

    attemptSolve(): void {
      this.solveSentence = this.puzzle.replace(/\s/g, '').split('') as Letter[];
      this.solvingIndex = getSolvingIndex(this);
    },

    get isVocalAvailable(): boolean {
      if (this.currentPlayer === null)
        throw new Error(
          "currentPlayer state shouldn't be null when isVocalAvailable is called"
        );

      return (
        (this.spinResult !== null &&
          this.currentPlayer.points >= BUY_VOCAL_PRICE) ||
        this.solvingIndex !== null
      );
    },

    get isConsonantAvailable(): boolean {
      return this.spinResult !== null || this.solvingIndex !== null;
    },

    get canSolve(): boolean {
      return this.spinResult === null;
    }
  };
};

//export type TStore = ReturnType<typeof createStore>;
