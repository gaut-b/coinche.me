import {NORTH, EAST, SOUTH, WEST, POSITIONS} from '../../shared/constants/positions';

export default function subjectiveState(state, playerId) {
  const playerIndex = state.players.findIndex(p => p.id === playerId);

  if (!playerId) {
    console.error('playerId missing in subjectiveState');
    return state;
  }
  if (playerIndex === -1) {
    console.error('playerId not found in players', playerId);
    return state;
  }

  const updatedPlayers = POSITIONS.map((position, i) => {
    return {
      ...state.players[(playerIndex + i) % state.players.length],
      position,
    }
  })

  return {
    ...state,
    players: updatedPlayers,
  };
};