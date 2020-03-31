import React, {useContext} from 'react';
import {connect} from 'react-redux';
import {selectTricks, selectPlayers} from '../redux/selectors';
import {newGame} from '../redux/actions';
import { TableIdContext } from '../pages/GamePage.js';

import Card from './Card';

const ScoreBoard = ({players, tricks, newGame}) => {

  const tableId = useContext(TableIdContext);
  return (
    <div className="has-text-centered">
      {
        players.map(p => {
          const playerTricks = tricks.filter(({playerIndex}) => p.index === playerIndex)
          return (
            <div key={p.index}>
              <h2>{p.name || 'BOT'}</h2>
              <div className="hand">
              {
                playerTricks.map(({cards}) => {
                  return (cards.length) ? cards.map(c => <Card key={c} value={c} />) : <div>Vous n'avez fait aucun plis</div>
                })
              }
              </div>
            </div>
          );
        })
      }
      <button className="button is-primary is-large" onClick={() => newGame(tableId)} style={{marginTop: '2rem'}}>New game</button>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  newGame: (tableId) => dispatch(newGame(tableId)),
});

const mapStateToProps = (state) => ({
  players: state.players,
  tricks: state.tricks,
})

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoard);