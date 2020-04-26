import React, {useState} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {pluralize} from '../../../shared/utils/string';
import {last} from '../../../shared/utils/array';
import {
  selectHumanPlayers,
  selectCurrentPlayer,
  selectPlayers,
  selectTableId,
} from '../redux/selectors';
import {queryParamToJoin} from '../constants';
import { distribute, swichTeams } from '../redux/actions/socketActions';
import '../../scss/components/controls.scss';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

const Controls = ({humanPlayers, currentPlayer, distribute, swichTeams, players, tableId}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(`${document.location.origin}?${queryParamToJoin}=${tableId}`);
    setIsCopied(true);
  }

  const disableDistribute = humanPlayers.length !== players.length;
  const sortedPlayers = [NORTH, WEST, EAST, SOUTH].map(pos => players.find(p => p.position === pos));
  const southPlayer = last(sortedPlayers);
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return (
    <div className="commands has-text-centered">
      <div className="wrapper">
        <div className="section is-vertical is-small waiting">
          <h2 className="title is-4">{pluralize(humanPlayers.length, 'joueur prêt')} :</h2>
          {players.length ? (
            <ul className="players-waiting-list">
              {sortedPlayers.map((p, i) => (
                <li key={i}>
                  { p.id ? (
                      <button className="button is-text" onClick={e => swichTeams([southPlayer.index, p.index])}>{p.name}</button>
                    ) : <span>En attente ...</span>
                  }
                </li>
              )
            )}
            </ul>
          ) : null}
          {humanPlayers.length >= 2 && <p><small>Cliquez sur le nom d'un autre joueur pour rejoindre son équipe, et sur le votre pour échanger les places des joueurs adverses.</small></p>}
        </div>
        <ul className="section is-vertical is-small actions">
          <li>
            <button
              onClick={() => distribute(currentPlayer.id)}
              className="button is-primary is-large"
              title={disableDistribute ? 'Il faut 4 joueurs pour démarrer une partie' : ''}
              disabled={disableDistribute}
            >
              <span>Distribuer</span>
              <span className="is-hidden-mobile">&nbsp;une partie</span>
            </button>
          </li>
          {isDevelopment && disableDistribute && <li><button className="button is-text is-small" onClick={e => distribute(currentPlayer.id)}>(Forcer)</button></li>}
          <li>
            <button className={`button ${disableDistribute ? 'is-primary' : 'is-text'}`} onClick={copyUrlToClipboard}>
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
  tableId: selectTableId,
  currentPlayer: selectCurrentPlayer,
  humanPlayers: selectHumanPlayers,
  players: selectPlayers,
});

const mapDispatchToProps = {
  distribute,
  swichTeams,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);