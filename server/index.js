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
  const {sub, pub} = initRedis();
  console.log(socket.id)
});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})