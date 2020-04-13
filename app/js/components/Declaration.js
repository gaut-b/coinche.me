import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, newGame } from '../redux/actions';
import { createStructuredSelector } from 'reselect';
import { selectPlayers, selectCurrentPlayer, selectCurrentDeclaration, selectIsActivePlayer, selectDeclarationsHistory } from '../redux/selectors';
import { LocalStateContext } from '../pages/GamePage';
import DeclarationHistory from './DeclarationHistory';
import trumpTypes from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';

const HeartSymbol = require('../../images/heart.svg');
const SpadesSymbol = require('../../images/spades.svg');
const DiamondSymbol = require('../../images/diamonds.svg');
const ClubSymbol = require('../../images/clubs.svg');

const symbols = {
  'H': HeartSymbol,
  'S': SpadesSymbol,
  'D': DiamondSymbol,
  'C': ClubSymbol,
};

import '../../scss/components/declaration.scss';

const INITIAL_STATE = {
  goal: 80,
  trumpType: null,
};

const Declaration = ({players, currentPlayer, currentDeclaration, declarationsHistory, declare, launchGame, newGame, isActivePlayer}) => {

  const {tableId} = useContext(LocalStateContext);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (currentDeclaration) {
      
      // If currentPlayer made a declaration and everybody else passed OR somebody coinched
      // launch the game
      if (((currentDeclaration.playerId === currentPlayer.id) && isActivePlayer) || (currentDeclaration.isCoinched)) {
        launchGame(tableId);
        return;
      };

      // If everybody passed, create a new game
      if ((declarationsHistory.length === 4) && (!Object.entries(currentDeclaration.content).length)) {
        console.log('new game')
        newGame(tableId);
        return;
      };

      if (Object.entries(currentDeclaration.content).length) {
        const content = currentDeclaration.content;
        const prevGoal = parseInt(content.goal);
        const newGoal = (prevGoal < 160) ? prevGoal + 10 : prevGoal;
        setState({
          ...state,
          goal: newGoal,
        });
      }
    }
  }, [currentDeclaration]);

  const handleChange = (event) => {
    const target = event.target;
    setState({
      ...state,
      [target.name]: target.value,
    })
  };

  const toggleCapot = (event) => {
    if (state.goal === 250) {
      let prevGoal = 80;

      if (currentDeclaration) {
        prevGoal = parseInt(currentDeclaration.content.goal) + 10
      };
      setState({
        ...state,
        goal: prevGoal,
      });
      return;
    }

    setState({
      ...state,
      goal: parseInt(250),
    })
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
    let type = event.target.name;
    console.log(type)
    let content = {}
    if (type !== trumpTypes.PASS) {
      content = {...state}
    }

    declare(tableId, currentPlayer.id, {type, content})
  };

  let isDisabled = false;
  if (!state.gameType) {
    isDisabled = false;
  } else if (currentDeclaration) {
    isDisabled = currentDeclaration.content.goal === 250;
  };

  return (
    <div className="declaration box modal is-active" >
      <div className="modal-content media">
        <div className={`content media-left ${(isActivePlayer) ? null : 'is-disabled'}`}>
          <form onSubmit={handleSubmit}>
            <div className="field is-grouped level">
              <label className="control number">Annonce</label>
              <div className="control level-item">
                <input
                  className="input" 
                  type="number"
                  disabled={state.goal === 250}
                  name="goal"
                  min={state.goal}
                  step="10"
                  max="160"
                  value={state.goal}
                  onChange={handleChange}
                />
              </div>
              <label className="control checkbox level-item" onChange={toggleCapot}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="goal"
                  onChange={toggleCapot}
                  checked={state.goal === 250}
                />
                Capot
              </label>
            </div>
            <div className="field is-grouped level">
              <label className="control level-item" onChange={handleChange}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.S}
                  checked={state.trumpType === trumpTypes.S}
                  onChange={handleChange}
                  required
                />
                <span className="icon is-medium is-center"><img src={symbols['S']} alt="SpadesSymbol"/></span>
              </label>
              <label className="control level-item" onChange={handleChange}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.H}
                  onChange={handleChange}
                  checked={state.trumpType === trumpTypes.H}
                />
                <span className="icon is-medium is-center"><img src={symbols['H']} alt="HeartSymbol"/></span>
              </label>
              <label className="control level-item" onChange={handleChange}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.D}
                  checked={state.trumpType === trumpTypes.D}
                  onChange={handleChange}
                />
                <span className="icon is-medium is-center"><img src={symbols['D']} alt="DiamondSymbol" /></span>
              </label>
              <label className="control radio level-item" onChange={handleChange}>
                <input
                  className="form-check-input is-danger"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.C}
                  checked={state.trumpType === trumpTypes.C}
                  onChange={e => handleChange(e)}
                />
                <span className="icon is-medium is-center"><img src={symbols['C']} alt="ClubsSymbol"/></span>
              </label>
              <label className="control level-item" onChange={handleChange}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.ALL_TRUMP}
                  checked={state.trumpType === trumpTypes.ALL_TRUMP}
                  onChange={handleChange}
                />
                Tout atout
              </label>
              <label className="control level-item" onChange={handleChange}>
                <input
                  className="form-check-input is-danger"
                  type="radio"
                  name="trumpType"
                  value={trumpTypes.NO_TRUMP}
                  checked={state.trumpType === trumpTypes.NO_TRUMP}
                  onChange={handleChange}
                />
                Sans atouts
              </label>
            </div>
            <div className="field is-grouped is-grouped-centered">
              <p className="control">
                <input className="button is-primary" type="submit" value={declarationTypes.DECLARE} placeholder="Annoncer" />
              </p>
              <p className="control">
                <input className="button is-primary" type="submit" value={declarationTypes.PASS} placeholder="Passer" />
              </p>
            </div>
          </form>
        </div>
        <div className="content media-right is-centered">
          <DeclarationHistory />
          <div className="buttons is-centered">
            <button className="button is-primary" name={declarationTypes.COINCHE} >Coincher</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  currentPlayer: selectCurrentPlayer,
  currentDeclaration: selectCurrentDeclaration,
  declarationsHistory: selectDeclarationsHistory,
  isActivePlayer: selectIsActivePlayer,
});

const mapDispatchToProps = (dispatch) => ({
  declare: (tableId, playerId, declaration) => dispatch(declare(tableId, playerId, declaration)),
  launchGame: (tableId) => dispatch(launchGame(tableId)),
  newGame: (tableId) => dispatch(newGame(tableId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Declaration);


