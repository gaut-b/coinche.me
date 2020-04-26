import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLastTrick } from '../redux/selectors/game';
import { selectIsLastTrickVisible } from '../redux/selectors/local';
import { toggleIsLastTrickVisible } from '../redux/actions/localActions';
import Card from './Card';

import '../../scss/components/lastTrick.scss';

const LastTrick = ({isLastTrickVisible, toggleIsLastTrickVisible, lastTrick}) => {

  return (
    <div className={`overlay ${isLastTrickVisible ? 'isVisible' : ''}`} onClick={e => toggleIsLastTrickVisible()} >
      <div className="overlay-content hand is-normal">
        { (lastTrick) ?
          lastTrick.cards.map( c => <Card key={c} value={c} /> ) :
          "Aucun plis n'a été joué pour le moment"
        }
      </div>
    </div>
    );
  };

  const mapStateToProps = createStructuredSelector({
    lastTrick: selectLastTrick,
    isLastTrickVisible: selectIsLastTrickVisible
  });

  const mapDispatchToProps = {
    toggleIsLastTrickVisible,
  }

  export default connect(mapStateToProps, mapDispatchToProps)(LastTrick);