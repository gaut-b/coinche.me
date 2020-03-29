import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SOUTH, NORTH} from '../../../shared/constants/positions';
import {pluralize} from '../../../shared/utils/string';
import {random} from '../../../shared/utils/array';
import { playCard } from '../redux/actions';

import '../../scss/components/player.scss';

import Hand from './Hand.js';
// import Tricks from './Tricks.js';

const Player = ({position, player, playRandomCard}) => {
  if (!player) return null;
  const { name,
          isFirstPerson,
          isDealer,
          hand,
          tricks,
          isVirtual,
          id
        } = player;

  const $name = <p onClick={e => playRandomCard(id, hand)} className={`name ${isDealer ? 'is-dealer' : ''}`}>{isVirtual ? 'BOT' : name} ({pluralize(tricks.length, 'pli')})</p>;

  return (
    <div className={`player is-${position}`}>
      {position !== NORTH && $name}
      <Hand cards={hand} isSelectable={isFirstPerson} isHidden={!isFirstPerson} style={position === SOUTH ? "normal" : "compact"} />
      {position === NORTH && $name}
    </div>
  );
}

Player.propTypes = {
  position: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  player: state.players.find(p => (p.position === ownProps.position)),
});

const mapDispatchToProps = (dispatch) => ({
  playRandomCard: (playerId, hand) => dispatch(playCard(playerId, random(hand))),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);

