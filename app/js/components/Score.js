import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getScore } from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {selectScore,
				selectPlayers,
				selectLastMasterIndex,
				selectCurrentPlayer,
				selectIsCoinched,
				selectCurrentDeclaration} from '../redux/selectors';

const Score = ({ getScore, score, players, currentPlayer, isCoinched, lastMasterIndex, currentDeclaration }) => {

	const {tableId} = useContext(LocalStateContext);

	if (!score) return null;

	useEffect(() => {
	  getScore(tableId)
	}, []);

	const currentPlayerIndex = currentPlayer.index;


	const teamScore = players.reduce((teamScore, player, index) => {

	const team  = (index % 2 === currentPlayerIndex % 2) ? 'NOUS' : 'EUX';

		teamScore[team].score = (teamScore[team].score || 0) + (score[player.index] || 0);
		teamScore[team].lastTen = (teamScore[team].lastTen) || (player.index === lastMasterIndex);
		teamScore[team].hasBelote = (teamScore[team].hasBelote) || (player.hasBelote);
		teamScore[team].declaration = (teamScore[team].declaration) || currentDeclaration.playerId === player.id;
		return teamScore;
	}, {NOUS:{}, EUX: {}});

	return (
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
						const belote = teamScore[teamName].belote ? 20 : 0;
						const coef = (!isCoinched) ? 1 : isCoinched;
						const preTotal = teamScore[teamName].score + teamScore[teamName].lastTen;
						let total = 0;
						if ((currentDeclaration.content.goal === 250) && (preTotal === 162)) {
							total = 250 * coef + belote;
						} else if ((teamScore[teamName].declaration) && (preTotal >= currentDeclaration.content.goal)) {
							total = currentDeclaration.content.goal * coef + belote;
						} else if ((teamScore[teamName].declaration) && (preTotal < currentDeclaration.content.goal)) {
							total = belote;
						} else if ((!teamScore[teamName].declaration) && (preTotal > (162 - currentDeclaration.content.goal))) {
							total = 162 * coef + belote;
						};

						return (
							<td key={teamName}>
								<table className="table is-fullwidth">
									<thead><tr><td>{teamName}</td></tr></thead>
									<tbody>
										<tr>{teamScore[teamName].score}</tr>
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
	currentDeclaration: selectCurrentDeclaration,
});

export default connect(mapStateToProps, mapDispatchToProps)(Score);