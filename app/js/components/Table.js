import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({cards}) => {
  return (
    <div className="playing-table">
      {cards.map(({position, value}, index) => {
        return (
          <div key={value} className={`table-slot is-${position}`} style={{zIndex: index}}>
            {value && <Card value={value} />}
          </div>
        );
      })}
    </div>
  )
};

Table.propTypes = {
  cards: PropTypes.array.isRequired,
}

export default Table;