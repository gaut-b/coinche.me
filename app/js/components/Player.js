import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../scss/components/player.scss';

import Hand from './Hand.js';
import Tricks from './Tricks.js';

const Player = ({tablePosition, players}) => {

  const player = players.find(p => p.position === tablePosition)
  if (!player) return null;
  const { name,
          position,
          isFirstPerson,
          isDealer,
          hand,
          tricks,
        } = player;

  return (
    <div className={`player is-${position}`}>
      <p className={`name ${isDealer ? 'is-dealer' : ''}`}>{name}</p>
      <Hand cards={hand} isSelectable={isFirstPerson} isHidden={!isFirstPerson} style="compact" />
    </div>
  );
}

Player.propTypes = {
  tablePosition: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  players: state.players,
});

export default connect(mapStateToProps)(Player);

