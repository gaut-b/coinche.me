import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SOUTH, NORTH} from '../../../shared/constants/positions';
import {pluralize} from '../../../shared/utils/string';
import {random} from '../../../shared/utils/array';
import { playCard, collect } from '../redux/actions';
import {TableIdContext} from '../pages/GamePage';
import { selectCanCollect} from '../redux/selectors';

import '../../scss/components/player.scss';

import Hand from './Hand.js';
// import Tricks from './Tricks.js';

const Player = ({position, player, tricks, playRandomCard, canCollect, collect}) => {

  const tableId = useContext(TableIdContext);

  if (!player) return null;
  const { name,
          isDealer,
          hand,
          id,
          index,
        } = player;

  const handleClick = (e) => {
    if (!id) playRandomCard(tableId, hand)
    return;
  }

  const playerTricks = tricks.filter(({playerIndex, _}) => playerIndex === index);

  const $name = (
    <div className="name">
      <span onClick={handleClick} >{!id ? 'BOT' : name} {isDealer ? 'a distribué' : ''} ({pluralize(playerTricks.length, 'pli')})</span>
      &nbsp;
      {!id && canCollect && <button className="button is-small is-text is-rounded" onClick={e => collect(tableId, index)}>Ramasser</button> }
    </div>
  );

  const isFirstPerson = (position === SOUTH) ? true : false;

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
  tricks: state.tricks,
  canCollect: selectCanCollect(state),
});

const mapDispatchToProps = (dispatch) => ({
  playRandomCard: (tableId, hand) => dispatch(playCard(tableId, random(hand))),
  collect: (tableId, index) => dispatch(collect(tableId, index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);

