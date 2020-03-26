import React, { Component, useEffect } from 'react';

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';

import Table from './Table.js';
import Player from './Player.js';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const Game = ({onTable, players, onDistribute}) => {
  const emptyHands = players.map(p => p.hand).every(h => !h.length);

  useEffect( () => {
    socket.emit('joining', { data: 'User joining the room !' });
    socket.on('welcoming', (data) => console.log(data));
  }, []);

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
          <Player {...players.find(p => p.position === NORTH)}/>
        </div>
        <div className="level">
          <div className="level-left">
            <Player {...players.find(p => p.position === WEST)}/>
          </div>
          <div className="level-item">
            <Table cards={onTable} />
          </div>
          <div className="level-right">
            <Player {...players.find(p => p.position === EAST)}/>
          </div>
        </div>
        <div className="level">
          <Player {...players.find(p => p.position === SOUTH)}/>
        </div>
      </div>
    </div>
  );
}

export default Game;