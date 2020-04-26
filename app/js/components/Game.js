import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectIsDistributed,
  selectIsLastTrick,
  selectTricks,
  selectIsGameStarted
} from '../redux/selectors/game';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

import Table from './Table.js';
import Player from './Player.js';
import Controls from './Controls.js';
import Score from './Score.js';
import DeclarationForm from './DeclarationForm.js';
import ScoreReminder from './ScoreReminder.js';
import DeclarationReminder from './DeclarationReminder';

const Game = ({isDistributed, isLastTrick, isGameStarted, tricks}) => {

  const GameTable = () => {
    return (
      <div>
        <div className="level-container">
          <div className="level is-mobile">
            <Player position={NORTH} />
            {isGameStarted ? <DeclarationReminder /> : null}
          </div>
          <div className="level is-mobile">
            <Player position={WEST} />
            <div className="level-item">
            {!isGameStarted ? <DeclarationForm /> : <Table />}
            </div>
            <Player position={EAST} />
          </div>
          <div className="level is-mobile">
            <Player position={SOUTH} />
            <ScoreReminder />
          </div>
        </div>
      </div>
    );
  }

  const GameComponent = () => {
    if (!isDistributed && !tricks.length) return <Controls />;

    return (isLastTrick) ? <Score /> : <GameTable />;
  }

  return GameComponent();
}

const mapStateToProps = createStructuredSelector({
  isDistributed: selectIsDistributed,
  isLastTrick: selectIsLastTrick,
  tricks: selectTricks,
  isGameStarted: selectIsGameStarted,
});

export default connect(mapStateToProps)(Game);