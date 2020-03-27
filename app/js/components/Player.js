import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SOUTH, NORTH} from '../constants/positions';
import {pluralize} from '../utils/string';
import {random} from '../utils/array';
import { playCard } from '../redux/actions';

import '../../scss/components/player.scss';

import Hand from './Hand.js';
// import Tricks from './Tricks.js';

const Player = ({tablePosition, players, playRandomCard}) => {

  const player = players.find(p => p.position === tablePosition)
  if (!player) return null;
  const { name,
          position,
          isFirstPerson,
          isDealer,
          hand,
          tricks,
        } = player;

  const $name = <p onClick={e => playRandomCard(hand)} className={`name ${isDealer ? 'is-dealer' : ''}`}>{name} ({pluralize(tricks.length, 'pli')})</p>;

  return (
    <div className={`player is-${position}`}>
      {tablePosition !== NORTH && $name}
      <Hand cards={hand} isSelectable={isFirstPerson} isHidden={!isFirstPerson} style={tablePosition === SOUTH ? "normal" : "compact"} />
      {tablePosition === NORTH && $name}
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

const mapDispatchToProps = (dispatch) => ({
  playRandomCard: hand => dispatch(playCard(random(hand))),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);

