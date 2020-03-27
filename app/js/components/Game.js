import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { distributeSocket, distribute } from '../redux/actions';

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
socket.emit('joiningTable', {table: 'coinche'});

const Game = ({onTable, deck, dealerIndex, nbPlayers, players, distributeSocket, distribute}) => {

  const [isDistributed, setDistributed] = useState(false)
  const [conn, setConn] = useState({
    atTable: false,
    tableName: 'coinche'
  });

  const handleClick = () => {
    setDistributed(!isDistributed);
    distributeSocket(socket, conn.tableName, deck, dealerIndex, nbPlayers);
  }

  //  useEffect(() => {

  //   if(conn.atTable) {
  //     console.log('joining room');
  //     socket.emit('joiningTable', {table: 'coinche'});
  //   }

  //   return () => {
  //     if(conn.atTable) {
  //       console.log('leaving room');
  //       socket.emit('leavingTable', {
  //         tableName: 'coinche'
  //       })
  //     }
  //   }
  // });

  useEffect( () => {
    socket.on('cardsDistributed', hands => {
      console.log('heyyyy')
      distribute(JSON.parse(hands));
    });
  }, [players]);

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
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  deck: state.deck,
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