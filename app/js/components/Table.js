import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { collect } from '../redux/actions';
import PropTypes from 'prop-types';
import {TableIdContext} from '../pages/GamePage';
import {selectCurrentPlayer} from '../redux/selectors'

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({cards, currentPlayer, collect}) => {

  const tableId = useContext(TableIdContext);

  const handleClick = (e) => {
    e.stopPropagation();
    collect(tableId, currentPlayer.id, cards);
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

const mapStateToProps = state => ({
  currentPlayer: selectCurrentPlayer(state)
});

const mapDispatchToProps = (dispatch) => ({
  collect: (tableId, playerId, cards) => dispatch(collect(tableId, playerId, cards)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Table);