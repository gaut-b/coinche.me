import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { collect, undo } from '../redux/actions';
import PropTypes from 'prop-types';
import {TableIdContext} from '../pages/GamePage';
import {selectCurrentPlayer, selectCanCollect, selectOnTable} from '../redux/selectors'

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({onTable, currentPlayer, collect, undo, canCollect}) => {

  const tableId = useContext(TableIdContext);

  const handleClick = (e) => {
    e.stopPropagation();
    collect(tableId, currentPlayer.index);
  };

  return (
    <div className="playing-table">
      {canCollect && <button onClick={(e) => handleClick(e)} className="button is-primary is-collect">Ramasser</button>}
      <button className={`button is-primary ${!canCollect ? 'is-alone' : 'is-not-alone'}`} onClick={() => undo(tableId)} style={{marginTop: '2rem'}}>Undo</button>
      {onTable.map(({position, value}, index) => {
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
  onTable: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  currentPlayer: selectCurrentPlayer(state),
  onTable: selectOnTable(state),
  canCollect: selectCanCollect(state),
});

const mapDispatchToProps = (dispatch) => ({
  collect: (tableId, index) => dispatch(collect(tableId, index)),
  undo: (tableId) => dispatch(undo(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Table);