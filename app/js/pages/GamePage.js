import React, { useState } from 'react';
import Layout from '../components/Layout';
import Game from '../components/Game';

const GamePage = (props) => {
  return (
    <Layout>
      <Game {...props} />
    </Layout>
  );
};

export default GamePage;