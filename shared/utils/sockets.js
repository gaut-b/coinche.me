export const emitEachInRoom = (io, roomId, event, getData) => {
  io.to(roomId).clients((error, clients) => {
    if (error) throw error;

    console.log(clients);

    clients.map(clientId => {
      io.to(clientId).emit(event, getData(clientId))
    });
  });
}