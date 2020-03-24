import React, { Component } from 'react';

import Card from './Card.js'
import Hand from './Hand.js';
import Table from './Table.js';
import Player from './Player.js';

const Layout = () => (
  <div className="container">
    <div className="has-text-centered">
      <h1 className="title is-1">Le coincheur</h1>
      <p className="subtitle">Jouez en ligne avec vos amis</p>
    </div>
    <div className="section cardinal-points">
      <div className="level">
        <Player name="player 1" position="north" cards={['2C', '2H']} tricks={[]}/>
      </div>
      <div className="level">
        <div className="level-left">
          <Player name="player 2" position="west" cards={['2C', '2H']} tricks={[]}/>
        </div>
        <div className="level-item">
          <Table cards={[{value: '3C', position: 'south'}, {value: '3H', position: 'west'}, {value: '2C', position: 'north'}]} />
        </div>
        <div className="level-right">
          <Player name="player 3" position="east" cards={['2C', '2H']} tricks={[]}/>
        </div>
      </div>
      <div className="level">
        <Player name="Moi" position="south" cards={['2C', '2H']} isFirstPerson={true} tricks={[]} />
      </div>
    </div>
  </div>
)

export default Layout;