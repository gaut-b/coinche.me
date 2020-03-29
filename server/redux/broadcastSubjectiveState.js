const subjectiveState = (store, id) => {
  return store.getState();
}

export default function(tableId, io, store) {
  // console.log(tableId)
  return io.emit('update_state', store.getState());
  return io.to(tableId).emit('update_state', store.getState());
  return io.in(tableId).clients((error, clients) => {
    if (error) throw error;
    return clients.map(clientId => {
      console.log(clientId, io.to(clientId).emit)
      io.to(clientId).emit('update_state', subjectiveState(store, clientId))
      // io.sockets.connected[clientId].emit('update_state', subjectiveState(store, clientId))
    })
});
}