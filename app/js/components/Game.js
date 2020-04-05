import React, { Component, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useBeforeunload } from 'react-beforeunload';
import { createStructuredSelector } from 'reselect';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {selectIsDistributed, selectIsLastTrick, selectTricks} from '../redux/selectors';
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
import ScoreBoard from './ScoreBoard.js';

const Game = ({onTable, isDistributed, isLastTrick, subscribeServerUpdate, unsubscribeServerUpdate, tricks}) => {
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

  const GameComponent = () => {
    if (!isDistributed && !tricks.length) return <Controls />

    return (isLastTrick) ?
      <ScoreBoard /> :
      <div className="level-container">
        <div className="level is-mobile">
          <Player position={NORTH} />
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
        </div>
      </div>

  }

  return GameComponent();
}

const mapStateToProps = createStructuredSelector({
  isDistributed: selectIsDistributed,
  isLastTrick: selectIsLastTrick,
  tricks: selectTricks,
});

const mapDispatchToProps = (dispatch) => ({
  subscribeServerUpdate: (tableId, username) => dispatch(subscribeServerUpdate(tableId, username)),
  unsubscribeServerUpdate: (tableId) => dispatch(unsubscribeServerUpdate(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);