import React from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import { PuzzleBoard } from './components/PuzzleBoard/PuzzleBoard';
import { Wheel } from './components/Wheel';

const AppContainer = styled.div`
	text-align: center;
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

const AppIntro = styled.p`
	font-size: large;
`;

const App: React.FC = () => {
	return (
		<AppContainer>
			<AppHeader>
				<AppTitle>Wheel of Fortune</AppTitle>
			</AppHeader>
			<PuzzleBoard
				puzzle="This is the puzzle"
				unlockedLetters={new Set(['s', 'b', 'c'])}
			/>
			<Wheel />
		</AppContainer>
	);
};

export default App;
