import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

import '../../scss/components/tricks.scss';

const Tricks = ({ tricks }) => {

  const [isHidden, setHidden] = useState(true);
  const nbTricks = (tricks.length) ? (Math.floor(tricks.length / 4) + 1) : 0;
  const lastTricks = tricks.slice(0, 4);


  const handleClick = (e) => {
    e.stopPropagation();
    setHidden(!isHidden)
  }

  const renderTricks = () => {
    if (!tricks.length) return null;
    return (
      <div
        className={`tricks ${isHidden ? 'is-hidden-face' : ''}`}
        onClick={e => handleClick(e)}
      >
        <div className='nbTricks'>
          {nbTricks}
        </div>
        <div className={`cards ${isHidden ? 'is-hidden-face' : ''}`}>
          {lastTricks.map((card, index) => <Card key={index} isHidden={isHidden} value={card} />)}
        </div>
      </div>
    );
  };

  return renderTricks();
}

Tricks.propTypes = {
  tricks: PropTypes.array.isRequired,
}

export default Tricks;