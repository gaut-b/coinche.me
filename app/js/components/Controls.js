import React, {useContext} from 'react';
import { connect } from 'react-redux';
import {pluralize} from '../../../shared/utils/string';
import {selectHumanPlayers} from '../redux/selectors';
import { TableIdContext } from '../pages/GamePage.js';

const Controls = ({humanPlayers, currentPlayer, distribute}) => {
  const tableId = useContext(TableIdContext);

  return (
    <div >
      <h2 className="title has-text-centered">{pluralize(humanPlayers.length, 'joueur prêt')}:</h2>
      {humanPlayers.length ? <ul>
        {humanPlayers.map(p => <li key={p.id}>{p.name}</li>)}
      </ul> : null}

      <ul className="commands">
        <li>
          <button onClick={() => distribute(tableId, currentPlayer.id)} className="button is-primary is-large is-rounded">Distribuer une partie</button>
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = state => ({
  currentPlayer: selectCurrentPlayer(state),
  humanPlayers: selectHumanPlayers(state),
});

const mapDispatchToProps = dispatch => ({
  distribute: (tableId, playerId) => dispatch(distribute(tableId, playerId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);