import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getScore } from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {
	selectScore,
	selectPlayers,
	selectLastMasterIndex,
	selectCurrentPlayer,
	selectTeams,
	selectPartnerId,
	selectCurrentDeclaration,
} from '../redux/selectors';

import Declaration from './Declaration';

const ScoreBoard = ({ getScore, score, players, currentPlayer, lastMasterIndex, currentDeclaration, teams, partnerId }) => {

	const {tableId} = useContext(LocalStateContext);

	useEffect(() => {
	  getScore(tableId)
	}, []);

	return (!teams.filter(team => team.currentGame).length) ? null :
		<div className="table-container">
			<table className="table is-fullwidth score-board">
				<thead>
					<tr>
						<td>&nbsp;</td>
						{teams.map( (team, i) => <td key={i}>{team.name}</td>)}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Annonce</td>
						{teams.map( (team, i) => (team.currentGame.isBidderTeam) ? <td><Declaration value={currentDeclaration} /></td> : <td>&nbsp;</td> )}
					</tr>
					<tr>
						<td>Coinche</td>
						{teams.map( (team, i) => (team.currentGame.isBidderTeam) ? <td colspan="2">{team.currentGame.isCoinched}</td> : null )}
					</tr>
					<tr>
						<td>Points</td>
						{teams.map( (team, i) => <td key={i}>{team.currentGame.gameScore + ((team.currentGame.hasLastTen) ? 10 : 0)}</td>)}
					</tr>
					<tr>
						<td>Belote</td>
						{teams.map( (team, i) => <td key={i}>{(team.currentGame.hasBelote) ? 20 : 0}</td>)}
					</tr>
					<tr>
						<td>Total</td>
						{teams.map( (team, i) => <td key={i}>{team.currentGame.gameTotal}</td>)}
					</tr>
					<tr>
						<td>Total de la partie</td>
						{teams.map( (team, i) => <td key={i}>{(team.totalScore || 0) + team.currentGame.gameTotal}</td>)}
					</tr>
				</tbody>
			</table>
		</div>
};

const mapDispatchToProps = (dispatch) => ({
	getScore: (tableId) => dispatch(getScore(tableId)),
});

const mapStateToProps = createStructuredSelector({
	score: selectScore,
	players: selectPlayers,
	lastMasterIndex: selectLastMasterIndex,
	currentPlayer: selectCurrentPlayer,
	currentDeclaration: selectCurrentDeclaration,
	teams: selectTeams,
	partnerId: selectPartnerId
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoard);
