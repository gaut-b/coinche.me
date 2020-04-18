import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {trumpNames} from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import {selectPlayers} from '../redux/selectors';

const Declaration = ({value, players}) => {
  if (value) {
    console.log(value)
    const player = players.find(p => p.id === value.playerId);
    const {goal, trumpType} = value.content;
    const declaration = goal && trumpType ? `${goal} ${trumpNames[trumpType]}` : 'Passe';
    return <span>{player.name} : {declaration}</span>
  }
  return <span>Première annonce</span>
}

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
});

export default connect(mapStateToProps)(Declaration);
