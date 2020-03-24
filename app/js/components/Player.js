import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../scss/components/player.scss';

import Hand from './Hand.js';

const Player = ({name, position, isFirstPerson, cards, tricks}) => {
  return (
    <div className={`player is-${position}`}>
      <p className="name">{name}</p>
      <Hand cards={cards} isHidden={!isFirstPerson} style={isFirstPerson ? 'normal' : 'compact'} />
    </div>
  );
}

Player.propTypes = {
  name: PropTypes.string,
  position: PropTypes.string.isRequired,
  isFirstPerson: PropTypes.bool,
  cards: PropTypes.array.isRequired,
  tricks: PropTypes.array.isRequired,
}

export default Player;