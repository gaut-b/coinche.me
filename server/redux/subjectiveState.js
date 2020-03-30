import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';

export default function subjectiveState(store, playerId) {
  const state = store.getState();

  const playerIndex = state.players.findIndex(p => p.id === playerId);
  const playerName = state.players[playerIndex].name;

  if (playerIndex === -1) return state;

  const updatedPlayer = state.players.map((p, i) => {
    if (i === playerIndex) p.position = SOUTH;
    else if (i === ((playerIndex + 1) % 4)) p.position = WEST;
    else if (i === ((playerIndex + 2) % 4)) p.position = NORTH;
    else if (i === ((playerIndex + 3) % 4)) p.position = EAST;
    return p;
  });

  const updatedTable = state.onTable.map(card => {
    const playerIndex = updatedPlayer.findIndex(p => p.name === card.playerName);
    if (updatedPlayer === -1) return;
    card.position = updatedPlayer[playerIndex].position;
    return card;
  })

  return {
    ...state,
    onTable: updatedTable,
    players: updatedPlayer,
  };
};