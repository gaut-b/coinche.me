import React, { Component, useEffect } from 'react';

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';

import Table from './Table.js';
import Player from './Player.js';
import Header from './Header.js';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const Game = ({onTable, players, onDistribute}) => {
  const emptyHands = players.map(p => p.hand).every(h => !h.length);

  useEffect( () => {
    socket.emit('joining', { data: 'User joining the room !' });
    socket.on('welcoming', (data) => console.log(data));
    return () => {
      socket.emit('leaving', {data: 'User leaving the room !'});
    }
  });

  return (
    <div>
      <Header />
      <div className="section is-full-screen">
        <div className="level-container">
          <div className="level is-mobile">
            <Player tablePosition={NORTH} />
          </div>
          <div className="level is-mobile">
            <Player tablePosition={WEST} />
            <div className="level-item">
              {
                emptyHands ? (
                  <div className="section has-text-centered">
                    <button onClick={onDistribute} className="button is-primary is-large is-rounded">Distribuer une partie</button>
                  </div>
                ) : (
                  <Table cards={onTable} />
                )
              }
            </div>
            <Player tablePosition={EAST} />
          </div>
          <div className="level is-mobile">
            <Player tablePosition={SOUTH} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;