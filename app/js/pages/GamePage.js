import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions/socketActions';
import Layout from '../components/Layout';
import Game from '../components/Game';
import {localstorageUsernameKey} from '../constants';

export const LocalStateContext = createContext('');

const GamePage = ({subscribeServerUpdate, unsubscribeServerUpdate, match: {params: {tableId}}}) => {
  if (!tableId) return (
    <Redirect to="/" />
  );

  useBeforeunload(() => {
    unsubscribeServerUpdate(tableId)
  });

  useEffect(() => {
    subscribeServerUpdate(tableId, localStorage.getItem(localstorageUsernameKey))
    return () => {
      // unsubscribeServerUpdate(tableId);
    }
  }, []);

  const [localState, setLocalState] = useState({
    // tableId,
    isLastTrickVisible: false,
  });

  const toggleLastTrick = () => {
    setLocalState({
      ...localState,
      isLastTrickVisible: !localState.isLastTrickVisible,
    })
  };

  return (
    <LocalStateContext.Provider value={localState}>
      <Layout toggleLastTrick={toggleLastTrick}>
        <Game />
      </Layout>
    </LocalStateContext.Provider>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   subscribeServerUpdate: (tableId, username) => dispatch(subscribeServerUpdate(tableId, username)),
//   unsubscribeServerUpdate: (tableId) => dispatch(unsubscribeServerUpdate(tableId)),
// })

const mapDispatchToProps = {
  subscribeServerUpdate,
  unsubscribeServerUpdate
}

export default connect(null, mapDispatchToProps)(GamePage);