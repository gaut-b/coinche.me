import React, { Component } from 'react';
import '../../scss/components/hand.scss';
import Card from './Card';

const Hand = ({cards, isHidden, isCompact}) => {

  return (
    <div className={`hand ${isCompact && 'is-compact'}`}>
      {cards.map(c => <Card isHidden={isHidden} key={c} value={c} />)}
    </div>
  )
};

export default Hand;