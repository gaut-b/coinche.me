import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { TableIdContext } from '../pages/GamePage';
import { playCard } from '../redux/actions';
import PropTypes from 'prop-types';

import '../../scss/components/card.scss';

// Can't use import, require needed :(
const images = require('../../images/cards/*.svg');

const Card = ({value, isHidden, isSelectable, playCard}) => {
  const tableId = useContext(TableIdContext);
  const image = isHidden ? images['BLUE_BACK'] : images[value];

  const handleClick = (e) => {
    if (!isSelectable) return;
    playCard(tableId, value)
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
  playCard: (tableId, value) => dispatch(playCard(tableId, value)),
})

export default connect(null, mapDispatchToProps)(Card);