import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, newGame } from '../redux/actions';
import { createStructuredSelector } from 'reselect';
import { LocalStateContext } from '../pages/GamePage';
import Declaration from './Declaration';
import DeclarationHistory from './DeclarationHistory';
import {trumpTypes, trumpNames} from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import { last, range } from '../../../shared/utils/array';
import cardSymbols from '../../images/symbols';
import {selectPlayers,
        selectCurrentPlayer,
        selectIsActivePlayer,
        selectActivePlayer,
        selectDeclarationsHistory,
        selectPartnerId } from '../redux/selectors';
import {
  selectCurrentDeclaration
} from '../../../server/redux/selectors';
import {name} from '../../../shared/utils/player';

import '../../scss/components/DeclarationForm.scss';

// const INITIAL_STATE = {
//   goal: 80,
//   trumpType: null,
// };

const DeclarationForm = ({ players, currentPlayer, activePlayer, currentDeclaration, declarationsHistory, declare, launchGame, newGame, isActivePlayer, partnerId }) => {

  const {tableId} = useContext(LocalStateContext);
  const [state, setState] = useState({});

  const goalOptions = range(8, 16)
    .map(i => 10*i)
    .filter(i => !currentDeclaration || (i > currentDeclaration.goal))
    .map(i => ({name: i, value: i}))
    .concat({name: 'Capot', value: 250})

  const previousDeclarations = declarationsHistory.filter((_d, i) => i !== declarationsHistory.length - 1)

  useEffect(() => {
    if (currentDeclaration) {

      // If currentPlayer made a declaration and everybody else passed OR someone has surcoinched
      //  => launch the game
      if (((currentDeclaration.playerId === currentPlayer.id) && isActivePlayer) || (currentDeclaration.isCoinched === 4)) {
        launchGame(tableId);
        return;
      };

      // If everybody passed => create a new game
      if (declarationsHistory.length === 4 && !declarationsHistory.filter(d => d.type !== declarationTypes.PASS)) {
        newGame(tableId);
        return;
      };

      // setState({
      //   ...state,
      //   goal: currentDeclaration.goal,
      // });
    }
  }, [currentDeclaration]);

  const handleChange = (event) => {
    const target = event.target;
    setState({
      ...state,
      [target.name]: target.value,
    })
  };

  const doPass = () => {
    declare(tableId, currentPlayer.id, {
      type: declarationTypes.PASS,
    });
  };

  const doDeclare = () => {
    declare(tableId, currentPlayer.id, {
      type: declarationTypes.DECLARE,
      trumpType: state.trumpType,
      goal: state.goal,
    })
  };

  let isCoincheVisible = false;
  let isCoinched = false;

  if (currentDeclaration) {
    const lastBid = last(declarationsHistory);
    isCoinched = (currentDeclaration.isCoinched);
    isCoincheVisible = (currentPlayer.id !== lastBid.playerId) && (partnerId !== lastBid.playerId) && (currentDeclaration.playerId === lastBid.playerId);
  }

  const isDeclareDisabled = !state.goal || !state.trumpType || currentDeclaration && (currentDeclaration.goal === 250) || isCoinched;

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
    </div>
  );
};
      // <div className="column is-narrow content">
      //   <DeclarationHistory />
      //   <div className="buttons is-centered">
      //     <button
      //       className={`button is-primary ${!isCoincheVisible ? 'is-hidden' : ''}`}
      //       name={declarationTypes.COINCHE}
      //       onClick={handleClick}
      //       >
      //       {`${!isCoinched ? 'Coincher' : 'Surcoincher'}`}
      //       </button>
      //   </div>
      // </div>

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  currentPlayer: selectCurrentPlayer,
  activePlayer: selectActivePlayer,
  currentDeclaration: selectCurrentDeclaration,
  declarationsHistory: selectDeclarationsHistory,
  isActivePlayer: selectIsActivePlayer,
  partnerId: selectPartnerId,
});

const mapDispatchToProps = (dispatch) => ({
  declare: (tableId, playerId, declaration) => dispatch(declare(tableId, playerId, declaration)),
  launchGame: (tableId) => dispatch(launchGame(tableId)),
  newGame: (tableId) => dispatch(newGame(tableId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeclarationForm);

