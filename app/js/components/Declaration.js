import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {trumpNames} from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import {selectPlayers} from '../redux/selectors';

const Declaration = ({value, players}) => {
  if (value) {
    const {playerId, type, goal, trumpType} = value;
    const player = players.find(p => p.id === playerId);
    const declaration = type !== declarationTypes.PASS ? `${goal} ${trumpNames[trumpType]}` : 'Passe';
    return <span>{player.name} : {declaration}</span>
  }
  return <span>Première annonce</span>
}

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
});

export default connect(mapStateToProps)(Declaration);
