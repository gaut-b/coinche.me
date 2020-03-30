import React from 'react';
import { connect } from 'react-redux';
import {pluralize} from '../../../shared/utils/string';

const Controls = ({players, distribute}) => {
  const realPlayers = players.filter(p => p.id);
  return (
    <div >
      <h2 className="title has-text-centered">{pluralize(realPlayers.length, 'joueur prêt')}:</h2>
      {realPlayers.length ? <ul>
        {realPlayers.map(p => <li key={p.id}>{p.name}</li>)}
      </ul> : null}

      <ul className="commands">
        <li>
          <button onClick={() => distribute(tableId)} className="button is-primary is-large is-rounded">Distribuer une partie</button>
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = state => ({
  players: state.players,
});

const mapDispatchToProps = dispatch => ({
  distribute: (tableId) => dispatch(distribute(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);