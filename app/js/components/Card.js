import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../scss/components/card.scss';

// Can't use import, require needed :(
const images = require('../../images/cards/*.svg');

const Card = ({value, isHidden, isSelectable, onPlayCard}) => {
  const image = isHidden ? images['BLUE_BACK'] : images[value];
  return (image ? <img onClick={e => onPlayCard(value)} className={`playing-card ${isSelectable ? 'selectable' : ''}`} src={image} /> : <p>Carte inconnue</p>)
}

Card.propTypes = {
  isHidden: PropTypes.bool,
  isSelectable: PropTypes.bool,
  value: PropTypes.string.isRequired,
}

export default Card;