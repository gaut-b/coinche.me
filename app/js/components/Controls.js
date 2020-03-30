import React, {useContext, useState} from 'react';
import { connect } from 'react-redux';
import {pluralize} from '../../../shared/utils/string';
import {selectHumanPlayers, selectCurrentPlayer} from '../redux/selectors';
import { TableIdContext } from '../pages/GamePage.js';
import {queryParamToJoin} from '../constants';
import { distribute } from '../redux/actions';
import '../../scss/components/controls.scss';

const Controls = ({humanPlayers, currentPlayer, distribute, players}) => {
  const tableId = useContext(TableIdContext);

  const [isCopied, setIsCopied] = useState(false);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(`${document.location.origin}?${queryParamToJoin}=${tableId}`);
    setIsCopied(true);
  }

  return (
    <div className="commands has-text-centered">
      <div className="wrapper">
        <div className="section is-vertical is-small waiting">
          <h2 className="title is-4">{pluralize(humanPlayers.length, 'joueur prêt')}:</h2>
          {players.length ? (
            <ul className="players-waiting-list">
              {players.map((p, i) => <li key={i}>{p.id ? p.name : 'En attente ...'}</li>)}
            </ul>
          ) : null}
          {players.length > 0 && <p><button className="button is-text">Échanger les équipes</button></p>}
        </div>
        <ul className="section is-vertical is-small actions">
          <li>
            <button onClick={() => distribute(tableId, currentPlayer.id)} className="button is-primary is-large">
              <span>Distribuer</span>
              <span className="is-hidden-mobile">&nbsp;une partie</span>
            </button>
          </li>
          <li>
            <button className="button is-text" onClick={copyUrlToClipboard}>
              {isCopied ? 'Copié !' : <span>Copier l'URL<span className="is-hidden-mobile"> à partager pour rejoindre la partie</span></span>}
            </button>
            <p className="is-hidden-tablet">à partager pour rejoindre la partie</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  currentPlayer: selectCurrentPlayer(state),
  humanPlayers: selectHumanPlayers(state),
  players: state.players,
});

const mapDispatchToProps = dispatch => ({
  distribute: (tableId, playerId) => dispatch(distribute(tableId, playerId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Controls);