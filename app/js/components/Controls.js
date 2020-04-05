import React, {useContext, useState} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {pluralize} from '../../../shared/utils/string';
import {selectHumanPlayers, selectCurrentPlayer, selectPlayers} from '../redux/selectors';
import { LocalStateContext } from '../pages/GamePage.js';
import {queryParamToJoin} from '../constants';
import { distribute, swichTeams } from '../redux/actions';
import '../../scss/components/controls.scss';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

const Controls = ({humanPlayers, currentPlayer, distribute, swichTeams, players}) => {
  const {tableId} = useContext(LocalStateContext);

  const [isCopied, setIsCopied] = useState(false);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(`${document.location.origin}?${queryParamToJoin}=${tableId}`);
    setIsCopied(true);
  }

  const disableDistribute = humanPlayers.length !== players.length;
  const sortedPlayers = [NORTH, WEST, EAST, SOUTH].map(pos => players.find(p => p.position === pos));

  return (
    <div className="commands has-text-centered">
      <div className="wrapper">
        <div className="section is-vertical is-small waiting">
          <h2 className="title is-4">{pluralize(humanPlayers.length, 'joueur prêt')}:</h2>
          {players.length ? (
            <ul className="players-waiting-list">
              {sortedPlayers.map((p, i) => <li key={i} className={p.id ? 'has-text-weight-bold' : ''}>{p.id ? p.name : 'En attente ...'}</li>)}
            </ul>
          ) : null}
          {humanPlayers.length >= 2 && <p><button onClick={e => swichTeams(tableId)} className="button is-text">Échanger les équipes</button></p>}
        </div>
        <ul className="section is-vertical is-small actions">
          <li>
            <button
              onClick={() => distribute(tableId, currentPlayer.id)}
              className="button is-primary is-large"
              title={humanPlayers.length < 4 ? 'Il faut 4 joueurs pour démarrer une partie' : ''}
              disabled={disableDistribute}
            >
              <span>Distribuer</span>
              <span className="is-hidden-mobile">&nbsp;une partie</span>
            </button>
          </li>
          {disableDistribute && <li><button className="button is-text is-small" onClick={e => distribute(tableId, currentPlayer.id)}>(Forcer)</button></li>}
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

const mapStateToProps = createStructuredSelector({
  currentPlayer: selectCurrentPlayer,
  humanPlayers: selectHumanPlayers,
  players: selectPlayers,
});

const mapDispatchToProps = dispatch => ({
  distribute: (tableId, playerId) => dispatch(distribute(tableId, playerId)),
  swichTeams: (tableId) => dispatch(swichTeams(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Controls);