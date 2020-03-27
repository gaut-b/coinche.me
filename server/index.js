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
  socket.on('disconnect', reason => console.log(reason));

  socket.on('joinTable', data => {
    console.log('User joining table', data.table)
    socket.join(data.table)
  });

  socket.on('leaveTable', data => {
    console.log('User leaving table', data.table)
    socket.leave(data.table);
  });

  // socket.on('cardsDistributed', (data) => {
  //   const {table, hands} = data
  //   console.log('Broadcasting to the table', table, data);
  //   socket.broadcast
  //   .to(table)
  //   .emit('cardsDistributed', hands);
  // });

  socket.on('cardsDistributed', (data) => {
    const {table, hands} = data
    console.log('Broadcasting to the table', table, data);
    io.emit('cardsDistributed', hands);
  });

  // const {sub, pub} = initRedis();
  // sub.subscribe('gameState');

});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})