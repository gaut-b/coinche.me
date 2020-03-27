import React, { Component } from 'react';
import { connect } from 'react-redux';
import { playCard } from '../redux/actions';
import PropTypes from 'prop-types';

import '../../scss/components/card.scss';

// Can't use import, require needed :(
const images = require('../../images/cards/*.svg');

const Card = ({value, isHidden, isSelectable, playCard}) => {
  const image = isHidden ? images['BLUE_BACK'] : images[value];

  const handleClick = (e) => {
    if (!isSelectable) return;
    playCard(value)
  }
  return (
    <div className="card-wrapper">
      {image ? <img onClick={e => handleClick(event)} className={`playing-card ${isSelectable ? 'selectable' : ''}`} src={image} /> : <p>Carte inconnue</p>}
    </div>
  )
}

Card.propTypes = {
  isHidden: PropTypes.bool,
  isSelectable: PropTypes.bool,
  value: PropTypes.string.isRequired,
  playCard: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  playCard: value => dispatch(playCard(value)),
})

export default connect(null, mapDispatchToProps)(Card);