import { observable, action, computed } from 'mobx';
import { Consonant, Vocal, Sector, Letter } from './types';
import {
  vocals,
  consonants,
  BUY_VOCAL_PRICE,
  REACTION_TIMEOUT,
  SOLVE_TIMEOUT
} from './constants';

export class Player {
  @observable name: string = '';
  @observable points = 0;
  @observable totalPoints = 0;

  constructor(name: string) {
    this.name = name;
  }
}

function getSolvingIndex({
  solveSentence,
  solvingIndex,
  unlockedLetters
}: Store): number | null {
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

export class Store {
  @observable puzzle: string = '';
  @observable consonantOptions: Set<Consonant>;
  @observable vocalOptions = new Set<Vocal>(vocals);
  @observable unlockedLetters: Set<Letter>;
  @observable isSpinning: boolean = false;
  @observable spinResult: Sector | null = null;
  @observable players: Player[];
  @observable editingPlayers: boolean = false;
  @observable announcementText: string = 'Welcome to Wheel of Fortune!';
  @observable solvingIndex: number | null = null;
  @observable solveSentence: Letter[] | null = null;
  @observable isGameOver: boolean = false;
  @observable reactionTimeLimit: number = REACTION_TIMEOUT; // Maybe in the future this can be changed by the users
  @observable isVocalBought: boolean = false;
  @observable remainingTime: number = -1;

  @observable _userIndex: number = 0;
  _turnTimeoutId: number = -1;

  constructor(puzzle: string) {
    this.puzzle = puzzle.toUpperCase();
    this.consonantOptions = new Set<Consonant>(consonants);
    this.unlockedLetters = new Set<Letter>();
    this.players = [];
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
    this.clearTicking();
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
        this.announcementText = `${
          this.currentPlayer.name
        }, you spun ${this.spinResult.toString()}! Choose a consonant.`;
        this.remainingTime = this.reactionTimeLimit;
        this.clearTicking();
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
    this.announcementText = `${reason} Now it's ${
      this.currentPlayer.name
    }'s turn! Spin ${
      this.isVocalAvailable
        ? ', solve or buy a vocal for 250 points'
        : ' or solve'
    }.`;
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

    this.clearTicking();
    this.startTicking();
  };

  @action
  tickInterval = (): void => {
    if (!this.currentPlayer) return;
    this.remainingTime = this.remainingTime - 1;
    console.log(this.remainingTime);

    if (this.remainingTime < 0) {
      this.clearTicking();
      const message = `${this.currentPlayer.name}'s turn took too long (${this.reactionTimeLimit} seconds) so turn is changed to the next player.`;
      // Show an alert to catch attention for now until a better design has been implemented
      alert(message);
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
          this.announcementText = `Correct! ${this.currentPlayer.name} won the round and gained ${this.currentPlayer.points} points! Shall we play another round?`;
          this.currentPlayer.totalPoints += this.currentPlayer.points;
          for (let player of this.players) {
            player.points = 0;
          }
          this.isGameOver = true;
          this.clearTicking();
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
      this.remainingTime = this.reactionTimeLimit;
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
  };

  @action
  attemptSolve = (): void => {
    this.solveSentence = this.puzzle.replace(/\s/g, '').split('') as Letter[];
    this.solvingIndex = getSolvingIndex(this);
    this.startTicking(SOLVE_TIMEOUT);
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
    let sentence = prompt('Enter sentence for new round') || '';
    if (!sentence) return;
    this.puzzle = sentence.trim().toUpperCase();
    this.unlockedLetters.clear();
    this.isGameOver = false;
    this.beginTurn();
  };

  @action
  editPlayersToggle = (): void => {
    this.editingPlayers = !this.editingPlayers;
    if (this.editingPlayers) {
      this.clearTicking();
    } else if (!this.isGameOver) {
      this.beginTurn();
    }
  };

  @computed
  get currentPlayer(): Player | undefined {
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
      !this.editingPlayers
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
      !this.editingPlayers
    );
  }

  @computed
  get isTimeTicking(): boolean {
    return this.remainingTime > -1;
  }
}
