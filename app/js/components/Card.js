import React, { Component } from 'react';
import '../../scss/components/card.scss';

// Can't import :(
const images = require('../../images/cards/*.svg');

const Card = ({value, isHidden}) => {
  const image = !isHidden && images[value] || images['BLUE_BACK'];
  return (image ? <img className={`playing-card ${isHidden && 'is-hidden-face'}`} src={image} /> : <p>Carte inconnue</p>)
}

export default Card;