import { observable, action, computed } from 'mobx';
import { Consonant, Vocal, Sector, Letter } from './types';
import { vocals, consonants, BUY_VOCAL_PRICE } from './constants';

export class Player {
  @observable name: string = '';
  @observable points = 0;
  @observable totalPoints = 0;

  constructor(name: string) {
    this.name = name;
  }
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
  @observable turnTimeLimit: number = 5;
  @observable isVocalBought: boolean = false;

  _userIndex: number = 0;

  constructor(puzzle: string) {
    this.puzzle = puzzle.toUpperCase();
    this.consonantOptions = new Set<Consonant>(consonants);
    this.unlockedLetters = new Set<Letter>();
    this.players = [new Player('Antero'), new Player('Amal')];
  }

  @action
  addPlayer = (name: string): void => {
    this.players.push(new Player(name));
  };

  @action
  removePlayer = (name: string): void => {
    this.players = this.players.filter(player => player.name !== name);
  };

  get currentPlayer(): Player {
    return this.players[this._userIndex % this.players.length];
  }

  @action
  handleSpinResult = (result: Sector): void => {
    this.isSpinning = false;

    if (this.currentPlayer === null)
      throw new Error(
        'currentPlayer state shouldnt be null when handleSpinResult is called'
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
    }
  };

  @action
  changeTurn = (reason: string): void => {
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
  };

  /**
   * Used in normal and solve attempts
   * @param letter
   */

  @action
  attemptLetter = (letter: Letter): void => {
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
          this.announcementText = `Correct! ${this.currentPlayer.name} won the round and gained ${this.currentPlayer.points} points! Shall we play another round?`;
          this.currentPlayer.totalPoints += this.currentPlayer.points;
          for (let player of this.players) {
            player.points = 0;
          }
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
  };

  @action
  attemptSolve = (): void => {
    this.solveSentence = this.puzzle.replace(/\s/g, '').split('') as Letter[];
    this.solvingIndex = getSolvingIndex(this);
  };

  @action
  startNewRound = (): void => {
    let sentence = prompt('Enter sentence for new round') || '';
    this.puzzle = sentence.trim().toUpperCase();
    this.unlockedLetters.clear();
    this.isGameOver = false;
  };

  @computed
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
    return !this.isSpinning && this.spinResult === null && !this.isGameOver;
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
      this.spinResult === null
    );
  }
}

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

export type TStore = Store;
