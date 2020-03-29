import subjectiveState from './subjectiveState';

const broadcastSubjectiveState = (tableId, io, store) => {
  if (!tableId) return store.getState()

  io.to(tableId).clients((error, clients) => {
    if (error) throw error;
    console.log(clients)
    clients.map( client => {
      const subjectivedState = subjectiveState(store, client);
      io.to(client).emit('updated_state', subjectivedState)
    });
  });
};

export default broadcastSubjectiveState;
