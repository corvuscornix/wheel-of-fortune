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
  isOnlyVocalsLeft: boolean;
  isSpinning: boolean;
  spinResult: Sector | null;
  players: Player[];
  currentPlayer: Player | null;
  editingPlayers: boolean;
  isVocalAvailable: boolean;
  isVocalBought: boolean;
  isConsonantAvailable: boolean;
  announcementText: string;
  solvingIndex: number | null;
  solveSentence: Letter[] | null;
  canSolve: boolean;
  isSolving: boolean;
  _userIndex: number;
  isGameOver: boolean;
  addPlayer(name: string): void;
  removePlayer(name: string): void;
  changeTurn(reason: string): void;
  attemptLetter(letter: Letter): void;
  handleSpinResult(sector: Sector): void;
  attemptSolve(): void;
  startNewRound(): void;
  turnTimeLimit: number;
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

let _turnTimeoutId: number;

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
    isGameOver: false,
    turnTimeLimit: 5,
    isVocalBought: false,

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
          this.changeTurn(
            `Oh noooo, ${this.currentPlayer.name} went bankrupt!`
          );
          break;
        case Sector.LOSE_A_TURN:
          this.changeTurn(`${this.currentPlayer.name} spun and lost the turn.`);
          break;
        default:
          this.spinResult = result;
          this.announcementText = `${
            this.currentPlayer.name
          }, you spun ${this.spinResult.toString()}! Choose a consonant.`;
      }
    },

    changeTurn(reason: string): void {
      if (this.currentPlayer === null)
        throw new Error(
          "currentPlayer state shouldn't be null when changeTurn is called"
        );
      this._userIndex++;
      this.spinResult = null;
      this.solveSentence = null;
      this.solvingIndex = null;
      this.isVocalBought = false;
      this.announcementText = `${reason} Now it's ${
        this.currentPlayer.name
      }'s turn! Spin ${
        this.isVocalAvailable
          ? ', solve or buy a vocal for 250 points'
          : ' or solve'
      }.`;

      /*clearTimeout(_turnTimeoutId);
      _turnTimeoutId = setTimeout(() => {
        if (!this.currentPlayer) return;
        alert(
          `${this.currentPlayer.name}'s turn took too long (${this.turnTimeLimit} seconds) and turn is changed to the next player.`
        );
        this.changeTurn();
      }, this.turnTimeLimit);*/
    },

    /**
     * Used in normal and solve attempts
     * @param letter
     */
    attemptLetter(letter: Letter): void {
      letter = letter.toUpperCase() as Letter;
      if (this.currentPlayer === null) {
        throw new Error(
          "currentPlayer state shouldn't be null during letter attempt"
        );
      }

      if (this.solvingIndex !== null && this.solveSentence !== null) {
        this.solveSentence[this.solvingIndex] = letter;
        this.solvingIndex = getSolvingIndex(this);

        // Last letter of solve attempt was entered, check whether the attempt is correct or failed
        if (this.solvingIndex === null) {
          if (this.solveSentence.join('') === this.puzzle.replace(/\s/g, '')) {
            this.announcementText = `Correct! ${this.currentPlayer.name} won the round and gained ${this.currentPlayer.points} points!`;
            this.currentPlayer.totalPoints += this.currentPlayer.points;
            this.isGameOver = true;
          } else {
            this.changeTurn(
              `Good attempt but that was wrong, ${this.currentPlayer.name}..`
            );
          }

          this.solveSentence = null;
        }
        return;
      }

      if (vocals.indexOf(letter as Vocal) > -1) {
        this.currentPlayer.points -= BUY_VOCAL_PRICE;
        this.isVocalBought = true;
      } else {
        this.isVocalBought = false;
      }

      if (
        // Check if puzzle sentence contains the attempted letter and is not unlocket yet
        this.puzzle.indexOf(letter) > -1 &&
        !this.unlockedLetters.has(letter)
      ) {
        if (typeof this.spinResult === 'number') {
          this.currentPlayer.points += this.spinResult;
        }

        this.spinResult = null;

        this.announcementText = `Letter '${letter}' appears ${
          (this.puzzle.match(new RegExp(letter, 'g')) || []).length
        } times! Spin again${
          this.isVocalAvailable
            ? ', solve or buy a vocal for 250 points'
            : ' or solve'
        }.`;
      } else {
        this.changeTurn(`Letter '${letter}' doesn't appear in the sentence.`);
      }

      this.unlockedLetters.add(letter);
    },

    attemptSolve(): void {
      this.solveSentence = this.puzzle.replace(/\s/g, '').split('') as Letter[];
      this.solvingIndex = getSolvingIndex(this);
    },

    startNewRound(): void {
      let sentence = prompt('Enter sentence for new round') || '';
      this.puzzle = sentence.trim().toUpperCase();
      this.unlockedLetters.clear();
      this.isGameOver = false;
    },

    get isVocalAvailable(): boolean {
      if (this.currentPlayer === null)
        throw new Error(
          "currentPlayer state shouldn't be null when isVocalAvailable is called"
        );

      return (
        (this.spinResult === null &&
          !this.isSpinning &&
          !this.isVocalBought &&
          this.currentPlayer.points >= BUY_VOCAL_PRICE) ||
        this.solvingIndex !== null
      );
    },

    get isConsonantAvailable(): boolean {
      return (
        !this.isOnlyVocalsLeft &&
        !this.isSpinning &&
        (this.spinResult !== null || this.solvingIndex !== null)
      );
    },

    get canSolve(): boolean {
      return !this.isSpinning && this.spinResult === null && !this.isGameOver;
    },

    get isSolving(): boolean {
      return this.solvingIndex !== null;
    },

    get isOnlyVocalsLeft(): boolean {
      for (let letter of this.puzzle) {
        if (
          this.consonantOptions.has(letter as Consonant) &&
          !this.unlockedLetters.has(letter as Consonant)
        ) {
          return false;
        }
      }

      return true;
    }
  };
};

//export type TStore = ReturnType<typeof createStore>;
