import React, { Component, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useBeforeunload } from 'react-beforeunload';
import { distribute, subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions';
import { TableIdContext } from '../pages/GamePage.js';
import {pluralize} from '../../../shared/utils/string';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

import Table from './Table.js';
import Player from './Player.js';

const Game = ({onTable, deck, distribute, players, subscribeServerUpdate, unsubscribeServerUpdate}) => {

  const tableId = useContext(TableIdContext);

  useBeforeunload(() => {
    unsubscribeServerUpdate(tableId)
  });

  useEffect(() => {
    console.log('Subscribing to server update')
    subscribeServerUpdate(tableId)

    return () => {
      unsubscribeServerUpdate(tableId);
    }
  }, []);

  const realPlayers = players.filter(p => p.id);
  const isDistributed = players.filter(p => ((p.hand || []).length)).length;

  return (
    <div>
      {
        !isDistributed ? (
          <div >
            <h2 className="title has-text-centered">{pluralize(realPlayers.length, 'joueur prêt')}:</h2>
            {realPlayers.length ? <ul>
              {realPlayers.map(p => <li key={p.id}>{p.id}</li>)}
            </ul> : null}

            <ul className="commands">
              <li>
                <button onClick={() => distribute(tableId)} className="button is-primary is-large is-rounded">Distribuer une partie</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="level-container">
            <div className="level is-mobile">
              <Player position={NORTH} />
            </div>
            <div className="level is-mobile">
              <Player position={WEST} />
              <div className="level-item">
                <Table cards={onTable} />
              </div>
              <Player position={EAST} />
            </div>
            <div className="level is-mobile">
              <Player position={SOUTH} />
            </div>
          </div>
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  deck: state.deck,
  onTable: state.onTable,
  players: state.players,
});

const mapDispatchToProps = (dispatch) => ({
  subscribeServerUpdate: (tableId) => dispatch(subscribeServerUpdate(tableId)),
  unsubscribeServerUpdate: (tableId) => dispatch(unsubscribeServerUpdate(tableId)),
  distribute: (tableId) => dispatch(distribute(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);