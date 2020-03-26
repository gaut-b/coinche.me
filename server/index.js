import express from 'express';

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('joining', (data) => {
    console.log(data);
    socket.emit('welcoming', { hello: 'world'})
  });
  socket.on('leaving', (data) => {
    console.log(data);
  });
});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})