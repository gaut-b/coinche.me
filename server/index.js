import express from 'express';

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Redis = require('ioredis');
const redisURL = "redis://redis";

app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const initRedis = () => {
  const sub = new Redis(redisURL);
  const pub = new Redis(redisURL);
  return {sub, pub};
}

io.on('connection', (socket) => {
  socket.on('disconnect', reason => console.log(socket.id));

  socket.on('joinTable', data => {
    const {tableId, username} = data
    console.log(`User ${username} joining table ${tableId}`)
    socket.join(tableId)
  });

  socket.on('leaveTable', data => {
    console.log(`User ${username} leaving table ${tableId}`)
    socket.leave(tableId);
  });

  socket.on('cardsDistributed', (data) => {
    const {table, hands} = data
    console.log('Broadcasting to the table', table, data);
    socket.emit('cardsDistributed', hands);
    socket.broadcast
    .to(table)
    .emit('cardsDistributed', hands);
  });

  // socket.on('cardsDistributed', (data) => {
  //   const {table, hands} = data
  //   console.log('Broadcasting to the table', table, data);
  //   io.emit('cardsDistributed', hands);
  // });

  // const {sub, pub} = initRedis();
  // sub.subscribe('gameState');

});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})