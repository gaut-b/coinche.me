import express from 'express';
import { createStore, applyMiddleware } from 'redux';

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Redis = require('ioredis');
const redisURL = "redis://redis";
const redisInstance = new Redis(redisURL);
const redisKey = 'XXXXXX';
app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const rootReducer = (state = {test: 'coucou'}, action) => {
  switch (action.type) {
    case 'RECEIVE':
      return {test: action.payload.message};
    default:
      return state;
  }
}

const storeToRedis = store => next => action => {
  next(action);
  return redisInstance.set('redisKey', store.getState()).then(v => console.log(v))
}

const broadcastToClients = store => next => action => {
  console.log(action)
  const returnValue = next(action)
  // Do the broadcast
  return returnValue;
};

const store = createStore(rootReducer, applyMiddleware(...[storeToRedis, broadcastToClients]));

console.log(store.getState());

store.dispatch({
  type: 'RECEIVE',
  payload: {
    message: 'hello',
  },
})

console.log(store.getState());

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