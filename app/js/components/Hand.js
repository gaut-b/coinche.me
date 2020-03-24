import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../scss/components/hand.scss';
import Card from './Card';

const Hand = ({cards, isSelectable, isHidden, style}) => {

  return (
    <div className={`hand is-${style}`}>
      {cards.map(c => <Card isSelectable={isSelectable} key={c} value={isHidden ? '' : c} />)}
    </div>
  )
};

Hand.propTypes = {
  cards: PropTypes.array.isRequired,
  isHidden: PropTypes.bool,
  isSelectable: PropTypes.bool,
  style: PropTypes.string.isRequired,
}

export default Hand;