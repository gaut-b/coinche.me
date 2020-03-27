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
import Header from './Header.js';

const Game = ({onTable, isDistributed, deck, dealerIndex, nbPlayers, players, distributeSocket, distribute, ...props}) => {

  const {tableId, username} = props.match.params;
  // const tableId = 'coinche';
  // const username = 'tiego';

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
    <div>
      <Header />
      <div className="section is-full-screen">
        {
          !isDistributed ? (
            <ul className="commands">
              <li>
                <button onClick={handleClick} className="button is-primary is-large is-rounded">Distribuer une partie</button>
              </li>
            </ul>
          ) : (
            <div className="level-container">
              <div className="level is-mobile">
                <Player tablePosition={NORTH} />
              </div>
              <div className="level is-mobile">
                <Player tablePosition={WEST} />
                <div className="level-item">
                  <Table cards={onTable} />
                </div>
                <Player tablePosition={EAST} />
              </div>
              <div className="level is-mobile">
                <Player tablePosition={SOUTH} />
              </div>
            </div>
          )}
>>>>>>> 71c78230db97490f5d8f381f90ccba6fb05a4e5c
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