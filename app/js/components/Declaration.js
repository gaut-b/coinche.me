import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, newGame } from '../redux/actions';
import { createStructuredSelector } from 'reselect';
import { selectPlayers, selectCurrentPlayer, selectCurrentDeclaration, selectIsActivePlayer, selectDeclarationsHistory } from '../redux/selectors';
import { LocalStateContext } from '../pages/GamePage';
import DeclarationHistory from './DeclarationHistory';
import gameTypes from '../../../shared/constants/gameTypes';

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
  objectif: 80,
  gameType: gameTypes.STANDARD,
  selectedColor: null,
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
        const prevObjectif = parseInt(content.objectif);
        const newObjectif = (prevObjectif < 160) ? prevObjectif + 10 : prevObjectif;
        setState({
          ...state,
          gameType: content.gameType,
          selectedColor: content.selectedColor,
          objectif: newObjectif,
        });
      }
    }
  }, [currentDeclaration]);

  const handleChange = (event) => {

    const target = event.target;

    setState({
      ...state,
      [target.name]: target.value
    })
  };

  const handleClick = (event) => {

    const name = event.target.name;
    let content = {};
    let type = '';

    if (name === 'declare') {
      content = {
        ...state,
        objectif: (state.gameType === gameTypes.CAPOT) ? 250 : state.objectif
      };
      type = 'DECLARE';
    } else if (name === 'pass') {
      type = 'PASS';
    } else if (name === 'coinche') {
      type = 'COINCHE';
    }

    declare(tableId, currentPlayer.id, {type, content})
  };

  const isDeclareDisabled = state.gameType === gameTypes.CAPOT;
  const isTrumpDisabled = state.gameType === gameTypes.ALL_TRUMP || state.gameType === gameTypes.NO_TRUMP;

  return (
    <div className="declaration box modal is-active" >
      <div className="modal-content media">
        <div className={`content media-left ${(isActivePlayer) ? null : 'is-disabled'}`}>
          <div className="field">
            <label className="label">Annonce</label>
            <div className="control">
              <input
                className="input" type="number" disabled={isDeclareDisabled} name="objectif" min={state.objectif} step="10" max="160" value={state.objectif} onChange={e => handleChange(e)}/>
            </div>
          </div>

          <div className="field is-grouped is-grouped-multiline is-grouped-centered">
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                className="input"
                type="radio"
                name="gameType"
                value={gameTypes.STANDARD}
                checked={state.gameType === gameTypes.STANDARD}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              Standard
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                className="input"
                type="radio"
                name="gameType"
                value={gameTypes.ALL_TRUMP}
                checked={state.gameType === gameTypes.ALL_TRUMP}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              Tout atout
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                className="input"
                type="radio"
                name="gameType"
                value={gameTypes.NO_TRUMP}
                checked={state.gameType === gameTypes.NO_TRUMP}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              Sans atouts
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                className="input"
                type="radio"
                name="gameType"
                value={gameTypes.CAPOT}
                onChange={e => handleChange(e)}
                checked={state.gameType === gameTypes.CAPOT}
                className="form-check-input"
              />
              Capot
            </label>
          </div>

          <div className="field is-grouped is-grouped-multiline is-grouped-centered" >
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                className="input"
                type="radio"
                name="selectedColor"
                value="H"
                disabled={isTrumpDisabled}
                onChange={e => handleChange(e)}
                checked={state.selectedColor === "H"}
                className="form-check-input"
              />
              <span className="icon is-medium is-center"><img src={symbols['H']} alt="HeartSymbol"/></span>
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                type="radio"
                name="selectedColor"
                value="S"
                checked={state.selectedColor === "S"}
                disabled={isTrumpDisabled}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              <span className="icon is-medium is-center"><img src={symbols['S']} alt="SpadesSymbol"/></span>
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                type="radio"
                name="selectedColor"
                value="D"
                checked={state.selectedColor === "D"}
                disabled={isTrumpDisabled}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              <span className="icon is-medium is-center"><img src={symbols['D']} alt="DiamondSymbol" /></span>
            </label>
            <label className="control radio" onChange={e => handleChange(e)}>
              <input
                type="radio"
                name="selectedColor"
                value="C"
                checked={state.selectedColor === "C"}
                disabled={isTrumpDisabled}
                onChange={e => handleChange(e)}
                className="form-check-input"
              />
              <span className="icon is-medium is-center"><img src={symbols['C']} alt="ClubSymbol" /></span>
            </label>
          </div>

          <div className="field is-grouped is-grouped-centered">
            <p className="control">
              <button className="button is-primary" name="declare" onClick={handleClick}>Annoncer</button>
            </p>
            <p className="control">
              <button className="button is-primary" name="pass" onClick={handleClick}>Passer</button>
            </p>
          </div>
        </div>
        <div className="content media-right has-text-centered">
          <DeclarationHistory />
          <p className="control">
            <button className="button is-primary" name="coinche" onClick={handleClick}>Coincher</button>
          </p>
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
