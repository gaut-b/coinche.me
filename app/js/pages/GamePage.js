import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Layout from '../components/Layout';
import Game from '../components/Game';

const GamePage = ({match: {params: {tableId}}}) => {
  if (!tableId) return (
    <Redirect to="/" />
  );
  return (
    <Layout>
      <Game tableId={tableId} />
    </Layout>
  );
};

export default GamePage;