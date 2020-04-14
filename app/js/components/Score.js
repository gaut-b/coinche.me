import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getScore } from '../redux/actions';
import { selectScore, selectPlayers, selectLastMasterIndex, selectCurrentPlayer, selectIsCoinched } from '../redux/selectors';
import { LocalStateContext } from '../pages/GamePage.js';

const Score = ({ getScore, score, players, currentPlayer, isCoinched, lastMasterIndex }) => {

	const {tableId} = useContext(LocalStateContext);

	useEffect(() => {
	  getScore(tableId)
	}, []);

	// 0 % 2 = 0
	// 1 % 2 = 1
	// 2 % 2 = 0
	// 3 % 2 = 1 

	const currentPlayerIndex = currentPlayer.index;

	const teamScore = players.reduce((teamScore, player, index) => {

		const team  = (index % 2 === currentPlayerIndex % 2) ? 'NOUS' : 'EUX';

		teamScore[team].score = (teamScore[team].score || 0) + (score[player.index] || 0);
		teamScore[team].lastTen = (teamScore[team].lastTen) || (player.index === lastMasterIndex);
		teamScore[team].hasBelote = (teamScore[team].hasBelote) || (player.hasBelote);
		return teamScore;
	}, {NOUS:{}, EUX: {}});

	return (
		(!score) ? null :
		<div className="table-container">
			<table className="table is-fullwidth">
			<tr>
				<td>
					<table className="table is-fullwidth">
						<thead><tr><td>&nbsp;</td></tr></thead>
						<tbody>
							<tr>Points</tr>
							<tr>Dix de der</tr>
							<tr>Belote</tr>
							<tr>Total</tr>
						</tbody>
					</table>
				</td>
				{
					Object.keys(teamScore).map( (teamName) => {
						const lastTen = teamScore[teamName].lastTen ? 10 : 0;
						const playerScore = (teamScore[teamName].score + lastTen === 162) ? 240 : teamScore[teamName].score;
						const belote = teamScore[teamName].belote ? 20 : 0;
						const multiplicator = (isCoinched) ? 1 : 2;
						const total = (playerScore + lastTen) * multiplicator + belote;
						return (
							<td key={teamName}>
								<table className="table is-fullwidth">
									<thead><tr><td>{teamName}</td></tr></thead>
									<tbody>
										<tr>{playerScore}</tr>
										<tr>{lastTen}</tr>
										<tr>{belote}</tr>
										<tr>{total}</tr>
									</tbody>
								</table>
							</td>
					  );
					})
				}
			</tr>
			</table>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getScore: (tableId) => dispatch(getScore(tableId)),
});

const mapStateToProps = createStructuredSelector({
	score: selectScore,
	players: selectPlayers,
	lastMasterIndex: selectLastMasterIndex,
	currentPlayer: selectCurrentPlayer,
	isCoinched: selectIsCoinched,
});

export default connect(mapStateToProps, mapDispatchToProps)(Score);