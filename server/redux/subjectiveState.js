import {NORTH, EAST, SOUTH, WEST, POSITIONS} from '../../shared/constants/positions';

export default function subjectiveState(store, playerId) {
  const state = store.getState();
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

  const updatedTable = state.onTable.map(card => {
    const playerIndex = updatedPlayers.findIndex(p => p.name === card.playerName);
    if (updatedPlayers === -1) return;
    card.position = updatedPlayers[playerIndex].position;
    return card;
  })

  return {
    ...state,
    onTable: updatedTable,
    players: updatedPlayers,
  };
};