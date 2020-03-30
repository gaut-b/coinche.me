import React, { useState, createContext } from 'react';
import { Redirect } from "react-router-dom";
import Layout from '../components/Layout';
import Game from '../components/Game';

export const TableIdContext = createContext('');

const GamePage = ({match: {params: {tableId}}}) => {
  const [state, setState] = useState(tableId);

  if (!state) return (
    <Redirect to="/" />
  );
  return (
    <Layout>
      <TableIdContext.Provider value={state}>
        <Game />
      </TableIdContext.Provider>
    </Layout>
  );
};

export default GamePage;