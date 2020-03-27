import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { distributeSocket, distribute } from '../redux/actions';
import useSocket from './useSocket';

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';

import Table from './Table.js';
import Player from './Player.js';

const Game = ({onTable, isDistributed, deck, dealerIndex, nbPlayers, players, distributeSocket, distribute}) => {

  const tableId = 'coinche';
  const username = 'tiego';

  const [socket] = useSocket('http://localhost:3000');
  socket.connect()

  const handleClick = () => {
    distributeSocket(socket, tableId, deck, dealerIndex, nbPlayers);
  }

  useEffect(() => {
    socket.emit('joinTable', {
      tableId,
      username,
    });

    socket.on('cardsDistributed', hands => {
      distribute(JSON.parse(hands));
    });

    return () => {
      console.log('leaving room');
      socket.emit('leaveTable', {tableId, username});
    }
  }, []);

  return (
    <div className="container">
      <div className="has-text-centered">
        <h1 className="title is-1">Le coincheur</h1>
        <p className="subtitle">Jouez en ligne avec vos amis</p>
      </div>
      {
        !isDistributed && (
          <div className="section has-text-centered">
            <button onClick={handleClick} className="button is-dark is-large">Distribuer une partie</button>
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

const mapStateToProps = (state) => ({
  deck: state.deck,
  isDistributed: state.isDistributed,
  dealerIndex: state.players.findIndex(p => p.isDealer),
  nbPlayers: state.players.length,
  onTable: state.onTable,
  players: state.players,
});

const mapDispatchToProps = (dispatch) => ({
  distributeSocket: (socket, table, deck, dealerIndex, nbPlayers) => dispatch(distributeSocket(socket, table, deck, dealerIndex, nbPlayers)),
  distribute: (hands) => dispatch(distribute(hands)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);