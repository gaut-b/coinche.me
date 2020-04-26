import React, {useContext} from 'react';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {selectTricks, selectPlayers, selectTeams} from '../redux/selectors';
import {newGame} from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {include} from '../../../shared/utils/array';

import ScoreBoard from './ScoreBoard';
import Card from './Card';

const Score = ({players, tricks, teams, newGame}) => {

  const {tableId} = useContext(LocalStateContext);

  const teamWithTricks = teams.map(team => {
    return {
      ...team,
      tricks: tricks.filter(trick => {
        const player = players.find(p=> p.index === trick.playerIndex)
        return include(team.players, player.id)
        }),
      }
  });

  return (
    <div className="has-text-centered">
      <ScoreBoard />
      {
        teamWithTricks.map(({name, tricks}) => {
          return (
            <div key={name}>
              <h2>{name}</h2>
              <div className="hand">
              {
                tricks.length
                ? tricks.map(({cards}) => cards.map(c => <Card key={c} value={c} />))
                : <div>Vous n'avez fait aucun pli</div>
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

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  tricks: selectTricks,
  teams: selectTeams,
})

const mapDispatchToProps = (dispatch) => ({
  newGame: (tableId) => dispatch(newGame(tableId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Score);