import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../scss/components/player.scss';

import Hand from './Hand.js';

const Player = ({name, position, isFirstPerson, isDealer, hand, tricks, onPlayCard}) => {
  return (
    <div className={`player is-${position}`}>
      <p className={`name ${isDealer ? 'is-dealer' : ''}`}>{name}</p>
      <Hand onPlayCard={onPlayCard} cards={hand} isSelectable={isFirstPerson} isHidden={!isFirstPerson} style="compact" />
    </div>
  );
}

Player.propTypes = {
  name: PropTypes.string,
  position: PropTypes.string.isRequired,
  isDealer: PropTypes.bool,
  isFirstPerson: PropTypes.bool,
  hand: PropTypes.array.isRequired,
  tricks: PropTypes.array.isRequired,
}

export default Player;