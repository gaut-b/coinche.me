import React, { useState, createContext } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import Game from '../components/Game';

export const LocalStateContext = createContext('');

const GamePage = ({match: {params: {tableId}}}) => {
  const [localState, setLocalState] = useState({
    tableId,
    isLastTrickVisible: false,
  });

  const toggleLastTrick = () => {
    setLocalState({
      ...localState,
      isLastTrickVisible: !localState.isLastTrickVisible,
    })
  };

  console.log(localState);

  if (!tableId) return (
    <Redirect to="/" />
  );
  return (
    <LocalStateContext.Provider value={localState}>
      <Layout toggleLastTrick={toggleLastTrick}>
        <Game />
      </Layout>
    </LocalStateContext.Provider>
  );
};

export default GamePage;