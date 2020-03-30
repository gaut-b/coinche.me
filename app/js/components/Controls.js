import React, {useContext, useState} from 'react';
import { connect } from 'react-redux';
import {pluralize} from '../../../shared/utils/string';
import {selectHumanPlayers, selectCurrentPlayer} from '../redux/selectors';
import { TableIdContext } from '../pages/GamePage.js';

const Controls = ({humanPlayers, currentPlayer, distribute}) => {
  const tableId = useContext(TableIdContext);

  const [isCopied, setIsCopied] = useState(false);

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(document.location.href);
    setIsCopied(true);
  }

  return (
    <div >
      <div className="commands">
        <div>
          <div className="section">
            <h2 className="title has-text-centered is-4">{pluralize(humanPlayers.length, 'joueur prêt')}:</h2>
            {humanPlayers.length ? <ul className="has-text-centered">
              {humanPlayers.map(p => <li key={p.id}>{p.name}</li>)}
            </ul> : null}
          </div>
          <ul className="has-text-centered">
            <li className="field">
              <button onClick={() => distribute(tableId, currentPlayer.id)} className="button is-primary is-large is-rounded">Distribuer une partie</button>
            </li>
            <li className="field">
              <button className="button is-text" onClick={copyUrlToClipboard}>{isCopied ? 'Copié !' : 'Copier l\'adresse de la partie'}</button>
            </li>
          </ul>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Controls);