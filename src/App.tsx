import './App.css';
import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import styled from 'styled-components';
import { PuzzleBoard } from './components/PuzzleBoard/PuzzleBoard';
import { Wheel } from './components/Wheel';

// TODO: follow this guide https://mobx-react.js.org/recipes-context
class AppState {
	@observable puzzle = 'Welcome to Wheel of Fortune';
	@observable unlockedLetters = new Set<string>();
	@observable isSpinning = false;

	constructor() {}
}

const AppContainer = styled.div`
	text-align: center;
	max-width: 1000px;
	margin: auto;
`;

const AppHeader = styled.header`
	background-color: #222;
	height: 50px;
	padding: 20px;
	color: white;
`;

const AppTitle = styled.h1`
	font-size: 1.5em;
`;

declare const window: any;
window.appState = new AppState();

@observer
class App extends React.Component {
	appState: AppState = window.appState;

	handleSetPuzzle() {}

	render() {
		const { puzzle, unlockedLetters } = this.appState;
		console.log(puzzle);
		return (
			<AppContainer>
				<AppHeader>
					<AppTitle>Wheel of Fortune</AppTitle>
				</AppHeader>
				<PuzzleBoard puzzle={puzzle} unlockedLetters={unlockedLetters} />
				<Wheel />
			</AppContainer>
		);
	}
}

export default App;
