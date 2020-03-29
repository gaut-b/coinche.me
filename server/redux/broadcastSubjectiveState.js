import subjectiveState from './subjectiveState';

export default function(tableId, playerId, io, store) {
  console.log(store.getState())
  const subjectivedState = subjectiveState(store, playerId)
  io.in(tableId).emit('updated_state', subjectivedState)
};
