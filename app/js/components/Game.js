import React, { Component, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useBeforeunload } from 'react-beforeunload';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions';
import { TableIdContext } from '../pages/GamePage.js';
import {selectIsDistributed} from '../redux/selectors';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

import Table from './Table.js';
import Player from './Player.js';
import Controls from './Controls.js';

const Game = ({onTable, isDistributed, subscribeServerUpdate, unsubscribeServerUpdate}) => {

  const tableId = useContext(TableIdContext);

  useBeforeunload(() => {
    unsubscribeServerUpdate(tableId)
  });

  useEffect(() => {
    subscribeServerUpdate(tableId)
    return () => {
      unsubscribeServerUpdate(tableId);
    }
  }, []);

  return (
    <div>
      {
        !isDistributed ? (
          <Controls />
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
  onTable: state.onTable,
  isDistributed: selectIsDistributed(state),
});

const mapDispatchToProps = (dispatch) => ({
  subscribeServerUpdate: (tableId) => dispatch(subscribeServerUpdate(tableId)),
  unsubscribeServerUpdate: (tableId) => dispatch(unsubscribeServerUpdate(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);