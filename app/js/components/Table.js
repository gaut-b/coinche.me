import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { collect } from '../redux/actions';
import PropTypes from 'prop-types';
import {LocalStateContext} from '../pages/GamePage';
import {selectCurrentPlayer, selectCanCollect, selectOnTable} from '../redux/selectors'
import {SOUTH} from '../../../shared/constants/positions';

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({onTable, currentPlayer, collect, canCollect}) => {

  const {tableId} = useContext(LocalStateContext);

  const handleClick = (e) => {
    e.stopPropagation();
    collect(tableId, currentPlayer.index);
  };

  return (
    <div className="playing-table">
      {canCollect && <button onClick={(e) => handleClick(e)} className="button is-primary is-collect">Ramasser</button>}
      {onTable.map(({position, value}, index) => {
        return (
          <div key={value} className={`table-slot is-${position}`} style={{zIndex: index}}>
            {value && <Card value={value} isSelectable={position === SOUTH} />}
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