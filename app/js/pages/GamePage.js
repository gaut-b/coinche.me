import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions/socketActions';
import Layout from '../components/Layout';
import Game from '../components/Game';
import {localstorageUsernameKey} from '../constants';

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

  return (
    <Layout>
      <Game />
    </Layout>
  );
};

const mapDispatchToProps = {
  subscribeServerUpdate,
  unsubscribeServerUpdate
}

export default connect(null, mapDispatchToProps)(GamePage);