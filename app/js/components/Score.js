import React from 'react';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {selectTricks, selectPlayers, selectTeams} from '../redux/selectors/game';
import {newGame} from '../redux/actions/socketActions';
import {include} from '../../../shared/utils/array';

import ScoreBoard from './ScoreBoard';
import Card from './Card';

const Score = ({players, tricks, teams, newGame}) => {

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
      <button className="button is-primary is-large" onClick={() => newGame()} style={{marginTop: '2rem'}}>New game</button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  tricks: selectTricks,
  teams: selectTeams,
})

const mapDispatchToProps = {
  newGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(Score);