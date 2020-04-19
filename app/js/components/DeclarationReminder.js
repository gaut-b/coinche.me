import React from 'react';
import { connect } from 'react-redux';
import { selectPlayers, selectDeclarationsHistory } from '../redux/selectors';
import {
  selectCurrentDeclaration,
  selectIsCoinched
} from '../../../server/redux/selectors';
import declarationTypes from '../../../shared/constants/declarationTypes';
import trumpTypes from '../../../shared/constants/trumpTypes';
import cardSymbols from '../../images/symbols';

const DeclarationReminder = ({ players, currentDeclaration, declarationsHistory, isCoinched }) => {

	if (!currentDeclaration) return null;

	const playerName = players.find(p => p.id === currentDeclaration.playerId).name;

	const TrumpType = () => {
		if (currentDeclaration.trumpType === trumpTypes.ALL_TRUMP) {
			return "tout atout"
		} else if (currentDeclaration.trumpType === trumpTypes.NO_TRUMP) {
			return "sans-atouts"
		} else {
			return (
				<span className="icon is-small">
					<img src={cardSymbols[currentDeclaration.trumpType]}/>
				</span>
			)
		}
	}

	return (
		<div className="box">
			<h1 className="title is-4">{playerName}</h1>
			<div>
				{`${(isCoinched.length >= 2) ? 'Surcoinchée' : ((isCoinched.length === 1) ? 'Coinchée' : '')}`}
			</div>
			<div className="level">
				<div className="level-left">
					{currentDeclaration.goal}
				</div>
				<div className="level-right">
					<TrumpType />
				</div>
			</div>
		</div>
	);
};


const mapStateToProps = state => ({
	players: selectPlayers(state),
	currentDeclaration: selectCurrentDeclaration(state),
	declarationsHistory: selectDeclarationsHistory(state),
	isCoinched: selectIsCoinched(state),
})


export default connect(mapStateToProps)(DeclarationReminder);
