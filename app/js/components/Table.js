import React, { Component } from 'react';
import { connect } from 'react-redux';
import { collect } from '../redux/actions';
import PropTypes from 'prop-types';

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({cards, collect}) => {

  const handleClick = (e) => {
    e.stopPropagation();
    collect(cards);
  };

  return (
    <div className="playing-table" onClick={(e) => handleClick(e)}>
      {cards.map(({position, playerName, value}, index) => {
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

const mapDispatchToProps = (dispatch) => ({
  collect: (cards) => dispatch(collect(cards)),
})

export default connect(null, mapDispatchToProps)(Table);