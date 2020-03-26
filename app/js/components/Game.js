import React, { Component } from 'react';

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';

import Table from './Table.js';
import Player from './Player.js';

const Game = ({onTable, players, onDistribute}) => {
  const emptyHands = players.map(p => p.hand).every(h => !h.length);
  return (
    <div className="container">
      <div className="has-text-centered">
        <h1 className="title is-1">Le coincheur</h1>
        <p className="subtitle">Jouez en ligne avec vos amis</p>
      </div>
      {
        emptyHands && (
          <div className="section has-text-centered">
            <button onClick={onDistribute} className="button is-dark is-large">Distribuer une partie</button>
          </div>
        )
      }
      <div className="section">
        <div className="level">
          <Player tablePosition={NORTH} />
        </div>
        <div className="level">
          <div className="level-left">
            <Player tablePosition={WEST} />
          </div>
          <div className="level-item">
            <Table cards={onTable} />
          </div>
          <div className="level-right">
            <Player tablePosition={EAST} />
          </div>
        </div>
        <div className="level">
          <Player tablePosition={SOUTH} />
        </div>
      </div>
    </div>
  );
}

export default Game;