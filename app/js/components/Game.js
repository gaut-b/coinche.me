import React, { Component, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useBeforeunload } from 'react-beforeunload';
import { createStructuredSelector } from 'reselect';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {selectIsDistributed, selectIsLastTrick, selectTricks, selectIsGameStarted} from '../redux/selectors';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';
import {localstorageUsernameKey} from '../constants';

import Table from './Table.js';
import Player from './Player.js';
import Controls from './Controls.js';
import Score from './Score.js';
import Declaration from './Declaration.js';
import ScoreReminder from './ScoreReminder.js';
import DeclarationReminder from './DeclarationReminder';

const Game = ({onTable, isDistributed, isLastTrick, subscribeServerUpdate, unsubscribeServerUpdate, isGameStarted, tricks}) => {
  const {tableId} = useContext(LocalStateContext);

  useBeforeunload(() => {
    unsubscribeServerUpdate(tableId)
  });

  useEffect(() => {
    subscribeServerUpdate(tableId, localStorage.getItem(localstorageUsernameKey))
    return () => {
      unsubscribeServerUpdate(tableId);
    }
  }, []);

  const GameTable = () => {
    return (
      <div className="level-container">
        {!isGameStarted ? <Declaration /> : null}
        <div className="level is-mobile">
          <Player position={NORTH} />
          {isGameStarted ? <DeclarationReminder /> : null}
        </div>
        <div className="level is-mobile">
          <Player position={WEST} />
          <div className="level-item">
            <Table />
          </div>
          <Player position={EAST} />
        </div>
        <div className="level is-mobile">
          <Player position={SOUTH} />
          <ScoreReminder />
        </div>
      </div>
    );
  }

  const GameComponent = () => {
    if (!isDistributed && !tricks.length) return <Controls />;

    return (isLastTrick) ? <Score /> : <GameTable />;
  }

  return GameComponent();
}

const mapStateToProps = createStructuredSelector({
  isDistributed: selectIsDistributed,
  isLastTrick: selectIsLastTrick,
  tricks: selectTricks,
  isGameStarted: selectIsGameStarted,
});

const mapDispatchToProps = (dispatch) => ({
  subscribeServerUpdate: (tableId, username) => dispatch(subscribeServerUpdate(tableId, username)),
  unsubscribeServerUpdate: (tableId) => dispatch(unsubscribeServerUpdate(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);