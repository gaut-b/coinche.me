import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, newGame } from '../redux/actions/socketActions';
import { createStructuredSelector } from 'reselect';
import Declaration from './Declaration';
import {trumpNames} from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import { first, last, range } from '../../../shared/utils/array';
import {
  selectPlayers,
  selectCurrentPlayer,
  selectIsActivePlayer,
  selectActivePlayer,
  selectDeclarationsHistory,
  selectPartnerId,
  selectCurrentDeclaration,
  selectIsCoinched,
} from '../redux/selectors/game';

import {name} from '../../../shared/utils/player';

import '../../scss/components/DeclarationForm.scss';

const DeclarationForm = ({ players, currentPlayer, activePlayer, currentDeclaration, declarationsHistory, declare, launchGame, newGame, isActivePlayer, partnerId, isCoinched }) => {

  const goalOptions = range(8, 16)
    .map(i => 10*i)
    .filter(i => !currentDeclaration || (i > currentDeclaration.goal))
    .map(i => ({name: i, value: i}))
    .concat({name: 'Capot', value: 250})

  const [state, setState] = useState({goal: first(goalOptions).value});

  const previousDeclarations = declarationsHistory.filter((_d, i) => i !== declarationsHistory.length - 1)

  useEffect(() => {
    if (currentDeclaration) {
      // console.log(currentDeclaration, declarationsHistory)
      // If currentPlayer made a declaration and everybody else passed OR someone has surcoinched => launch the game
      if (((currentDeclaration.playerId === currentPlayer.id) && isActivePlayer) || (declarationsHistory.filter(d => d.type === declarationTypes.COINCHE).length === 2)) {
        launchGame();
        return;
      };
    };

    // If everybody passed => create a new game
    if (declarationsHistory.length === 4 && !declarationsHistory.filter(d => d.type !== declarationTypes.PASS).length) {
      newGame();
      return;
    };

  }, [currentDeclaration]);

  const handleChange = (event) => {
    const target = event.target;
    setState({
      ...state,
      [target.name]: target.value,
    })
  };

  const doPass = () => {
    declare(currentPlayer.id, {
      type: declarationTypes.PASS,
    });
  };

  const doDeclare = () => {
    declare(currentPlayer.id, {
      type: declarationTypes.DECLARE,
      trumpType: state.trumpType,
      goal: state.goal,
    })
  };

  const doCoinche = () => {
    declare(currentPlayer.id, {
      type: declarationTypes.COINCHE,
    })
  };

  let isCoincheVisible = false;

  if (currentDeclaration) {
    const lastBid = last(declarationsHistory);
    const isCoincheEnabled = (currentPlayer.id !== lastBid.playerId) && (partnerId !== lastBid.playerId) && (currentDeclaration.playerId === lastBid.playerId);
    const isOverCoincheEnabled = isCoinched.length && ((currentPlayer.id === currentDeclaration.playerId) || (partnerId === currentDeclaration.playerId));
    isCoincheVisible = isCoincheEnabled || isOverCoincheEnabled;
  }
  const isDeclareDisabled = !state.goal || !state.trumpType || currentDeclaration && (currentDeclaration.goal === 250) || isCoinched.length;

  return (
    <div className={`declaration ${isActivePlayer ? '' : 'is-disabled'}`}>
      <div>
        {previousDeclarations.length ? <ul>
          {previousDeclarations.map((d, i) => <li key={i} ><Declaration value={d} /></li>)}
        </ul> : null}
        <h3 className="title is-3 is-spaced">
          {<Declaration value={last(declarationsHistory)} />}
        </h3>
        <p className="subtitle is-4">
          {isActivePlayer ? 'C\'est à votre tour d\'annoncer' : `A ${name(activePlayer)} de parler`}
        </p>
      </div>
      <div className="form">
        <div className="field has-addons has-addons-centered">
          <p className="control">
            <span className="select">
              <select name="goal" onChange={handleChange}>
                {goalOptions.map(({name, value}) => <option key={value} value={value}>{name}</option>)}
              </select>
            </span>
          </p>
          <p className="control">
            <span className="select">
              <select name="trumpType" onChange={handleChange}>
                <option value={null} defaultValue={true}>Quelle couleur ?</option>
                {Object.entries(trumpNames).map(([k, v]) => <option key={k} value={k} >{v}</option>)}
              </select>
            </span>
          </p>
          <p className="control">
            <button className="button is-primary" type="submit" name={declarationTypes.DECLARE} disabled={isDeclareDisabled} onClick={e => doDeclare()}>Annoncer</button>
          </p>
        </div>
        <div className="field">
          <button className="button is-primary" type="submit" name={declarationTypes.PASS} onClick={e => doPass()}>Passer</button>
        </div>
      </div>
      <div className="field">
        <button className={`button is-primary ${!isCoincheVisible ? 'is-hidden' : ''}`} type="submit" name={declarationTypes.COINCHE} onClick={e => doCoinche()}>{`${!isCoinched.length ? 'Coincher' : 'Surcoincher'}`}</button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  currentPlayer: selectCurrentPlayer,
  activePlayer: selectActivePlayer,
  currentDeclaration: selectCurrentDeclaration,
  declarationsHistory: selectDeclarationsHistory,
  isActivePlayer: selectIsActivePlayer,
  partnerId: selectPartnerId,
  isCoinched: selectIsCoinched,
});

const mapDispatchToProps = {
  declare,
  launchGame,
  newGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeclarationForm);

