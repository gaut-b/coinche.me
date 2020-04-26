import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { collect } from '../redux/actions/socketActions';
import PropTypes from 'prop-types';
import {selectCurrentPlayer, selectCanCollect, selectOnTable} from '../redux/selectors'
import {SOUTH} from '../../../shared/constants/positions';

import '../../scss/components/table.scss';
import Card from './Card';

const Table = ({onTable, currentPlayer, collect, canCollect}) => {

  const handleClick = (e) => {
    e.stopPropagation();
    collect(currentPlayer.index);
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

const mapStateToProps = createStructuredSelector({
  currentPlayer: selectCurrentPlayer,
  onTable: selectOnTable,
  canCollect: selectCanCollect,
});

const mapDispatchToProps = {
  collect,
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);