import { useLocalStore } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import { Consonant, Vocal, Sector, Letter, AnnouncementType } from './types';
import {
  vocals,
  consonants,
  BUY_VOCAL_PRICE,
  REACTION_TIMEOUT,
  SOLVE_TIMEOUT,
  letters
} from './constants';

export class Player {
  @observable name: string = '';
  @observable points = 0;
  @observable totalPoints = 0;

  constructor(name: string) {
    this.name = name;
  }
}

export class Puzzle {
  constructor(public sentence: string, public subject: string) {}
}

function getSolvingIndex({
  solveSentence,
  solvingIndex,
  unlockedLetters
}: State): number | null {
  if (!solveSentence) {
    throw Error('Cannot get solving index when solving sentence is null');
  }

  for (
    let i = solvingIndex !== null ? solvingIndex + 1 : 0;
    i < solveSentence.length;
    i++
  ) {
    const letter = solveSentence[i];
    if (
      !unlockedLetters.has(letter as Letter) &&
      letters.has(letter as Letter)
    ) {
      return i;
    }
  }

  return null;
}

class Announcement {
  constructor(
    public message: string,
    public type: AnnouncementType = AnnouncementType.NEUTRAL
  ) {}
}

export class State {
  @observable puzzles: Puzzle[] = [];
  @observable consonantOptions: Set<Consonant>;
  @observable vocalOptions = new Set<Vocal>(vocals);
  @observable unlockedLetters: Set<Letter>;
  @observable isSpinning: boolean = false;
  @observable spinResult: Sector | null = null;
  @observable players: Player[] = [];
  @observable announcement: Announcement | null = null;
  @observable solvingIndex: number | null = null;
  @observable solveSentence: Letter[] | null = null;
  @observable isGameOver: boolean = false;
  @observable reactionTimeLimit: number = REACTION_TIMEOUT; // Maybe in the future this can be changed by the users
  @observable isVocalBought: boolean = false;
  @observable remainingTime: number = -1;
  @observable isEditingGame: boolean = true;

  @observable _currentPuzzleIndex: number = -1;
  @observable _userIndex: number = 0;
  _turnTimeoutId: number = -1;

  constructor() {
    this.consonantOptions = new Set<Consonant>(consonants);
    this.unlockedLetters = new Set<Letter>();
  }

  @action
  addPlayer = (name: string): void => {
    this.players.push(new Player(name));
  };

  @action
  removePlayer = (name: string): void => {
    this.players = this.players.filter(player => player.name !== name);
  };

  @action
  spin = (): void => {
    this.isSpinning = true;
    this.remainingTime = -1;
  };

  @action
  handleSpinResult = (result: Sector): void => {
    this.isSpinning = false;

    if (this.currentPlayer === undefined)
      throw new Error(
        "currentPlayer state shouldn't be null when handleSpinResult is called"
      );
    switch (result) {
      case Sector.BANKRUPT:
        this.currentPlayer.points = 0;
        this.changeTurn(`Oh noooo, ${this.currentPlayer.name} went bankrupt!`);
        break;
      case Sector.LOSE_A_TURN:
        this.changeTurn(`${this.currentPlayer.name} spun and lost the turn.`);
        break;
      default:
        this.spinResult = result;
        this.announcement = new Announcement(
          `${
            this.currentPlayer.name
          }, you spun ${this.spinResult.toString()}! Choose a consonant.`,
          AnnouncementType.POSITIVE
        );
        this.remainingTime = this.reactionTimeLimit;
        this.startTicking();
    }
  };

  @action
  changeTurn = (reason: string = ''): void => {
    if (this.currentPlayer === undefined)
      throw new Error(
        "currentPlayer state shouldn't be null when changeTurn is called"
      );
    this._userIndex++;
    this.announcement = new Announcement(
      `${reason} Now it's ${this.currentPlayer.name}'s turn! Spin ${
        this.isVocalAvailable
          ? ', solve or buy a vocal for 250 points'
          : ' or solve'
      }.`,
      AnnouncementType.NEGATIVE
    );
    this.beginTurn();
  };

  @action
  beginTurn = () => {
    if (!this.currentPlayer) return;
    this.spinResult = null;
    this.solveSentence = null;
    this.solvingIndex = null;
    this.isVocalBought = false;
    this.remainingTime = this.reactionTimeLimit;

    this.startTicking();
  };

  @action
  tickInterval = (): void => {
    if (!this.currentPlayer) return;
    this.remainingTime = this.remainingTime - 1;

    if (this.remainingTime < 0) {
      this.clearTicking();
      this.changeTurn();
    }
  };

  /**
   * Used in normal and solve attempts
   * @param letter
   */

  @action
  attemptLetter = (letter: Letter): void => {
    letter = letter.toUpperCase() as Letter;

    if (this.unlockedLetters.has(letter)) {
      return;
    }

    if (this.currentPlayer === undefined) {
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
          this.finishRound();
        } else {
          this.changeTurn(
            `Good attempt but that was wrong, ${this.currentPlayer.name}..`
          );
        }

        this.solveSentence = null;
      }
      return;
    }

    const isVocal = vocals.indexOf(letter as Vocal) > -1;

    if (isVocal && !this.isVocalAvailable) return;
    else if (!isVocal && !this.isConsonantAvailable) return;

    if (isVocal) {
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
      this.remainingTime = this.reactionTimeLimit;
      this.announcement = new Announcement(
        `Letter '${letter}' appears ${
          (this.puzzle.match(new RegExp(letter, 'g')) || []).length
        } times! Spin again${
          this.isVocalAvailable
            ? ', solve or buy a vocal for 250 points'
            : ' or solve'
        }.`,
        AnnouncementType.POSITIVE
      );
    } else {
      this.changeTurn(`Letter '${letter}' doesn't appear in the sentence.`);
    }

    this.unlockedLetters.add(letter);
  };

  @action
  attemptSolve = (): void => {
    this.solveSentence = this.puzzle.replace(/\s/g, '').split('') as Letter[];
    this.solvingIndex = getSolvingIndex(this);
    this.startTicking(SOLVE_TIMEOUT);
  };

  @action
  finishRound = (): void => {
    if (!this.currentPlayer) return;
    this.announcement = new Announcement(
      `${this.currentPlayer.name} won the round and gained ${this.currentPlayer.points} points! Shall we play another round?`,
      AnnouncementType.POSITIVE
    );
    this.currentPlayer.totalPoints += this.currentPlayer.points;
    for (let player of this.players) {
      player.points = 0;
    }
    this.isGameOver = true;
  };

  @action
  startTicking = (tickingTime?: number): void => {
    this.clearTicking();
    this.remainingTime =
      tickingTime !== undefined ? tickingTime : this.reactionTimeLimit;
    this._turnTimeoutId = setInterval(this.tickInterval, 1000);
  };

  @action
  clearTicking = (): void => {
    clearInterval(this._turnTimeoutId);
    this.remainingTime = -1;
  };

  @action
  startNewRound = (): void => {
    if (!this.isNewRoundAvailable) {
      return;
    }

    this._currentPuzzleIndex = this._currentPuzzleIndex + 1;
    this.unlockedLetters.clear();
    this.isGameOver = false;
    this.beginTurn();
  };

  @action
  startNewGame = (): void => {
    this._currentPuzzleIndex = -1;
    if (!this.isNewRoundAvailable) {
      return;
    }

    this.startNewRound();
  };

  @computed
  get puzzle(): string {
    const puzzleObj = this.puzzles[this._currentPuzzleIndex];
    if (puzzleObj) return puzzleObj.sentence.toUpperCase();

    return '';
  }

  @computed
  get puzzleSubject(): string {
    const puzzleObj = this.puzzles[this._currentPuzzleIndex];
    if (puzzleObj) return puzzleObj.subject;

    return '';
  }

  @computed
  get currentPlayer(): Player | undefined {
    if (!this.players) return undefined;
    return this.players[this._userIndex % this.players.length];
  }

  @computed
  get isVocalAvailable(): boolean {
    return (
      (this.spinResult === null &&
        !this.isSpinning &&
        !this.isVocalBought &&
        this.currentPlayer !== undefined &&
        this.currentPlayer.points >= BUY_VOCAL_PRICE) ||
      this.solvingIndex !== null
    );
  }

  @computed
  get isConsonantAvailable(): boolean {
    return (
      !this.isOnlyVocalsLeft &&
      !this.isSpinning &&
      (this.spinResult !== null || this.solvingIndex !== null)
    );
  }

  @computed
  get canSolve(): boolean {
    return (
      this.currentPlayer !== undefined &&
      !this.isSpinning &&
      this.spinResult === null &&
      !this.isGameOver &&
      !this.isEditingGame
    );
  }

  @computed
  get isSolving(): boolean {
    return this.solvingIndex !== null;
  }

  @computed
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

  @computed
  get canSpin(): boolean {
    return (
      !this.isOnlyVocalsLeft &&
      !this.isSpinning &&
      this.players.length > 0 &&
      this.spinResult === null &&
      !this.isGameOver &&
      !this.isEditingGame
    );
  }

  @computed
  get isTimeTicking(): boolean {
    return this.remainingTime > -1;
  }

  @computed
  get isNewRoundAvailable(): boolean {
    return this.puzzles.length - 1 > this._currentPuzzleIndex;
  }

  autoClearTicking = autorun(() => {
    if (this.isEditingGame || this.isGameOver || this.isSpinning) {
      this.clearTicking();
    }
  });

  completeLevelWhenAllLettersUnlocked = autorun(() => {
    for (let letter of this.puzzle) {
      if (!this.unlockedLetters.has(letter as Letter)) {
        return;
      }
    }

    this.finishRound();
  });

  hijackKeyboardInput = autorun(() => {
    if (this.isSolving || this.isVocalAvailable || this.isConsonantAvailable) {
      // Hijack any keypress when in certain state
      document.onkeypress = e => {
        e = e || window.event;

        this.attemptLetter(e.key as Letter);
      };
    } else {
      document.onkeypress = null;
    }
  });
}

export class AppState {
  private static instance: State;

  static getInstance(): State {
    if (AppState.instance) return this.instance;
    const createStore = (): State => {
      return new State();
    };
    AppState.instance = useLocalStore(createStore);

    return AppState.instance;
  }
}
