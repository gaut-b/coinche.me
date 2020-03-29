import express from 'express';
import { v4 as uuid } from 'uuid';
import getStore from './redux/store';
import subjectiveState from './redux/subjectiveState';
import {join, leave} from './redux/actions';

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/join', async (req, res) => {
  const tableId = req.body.tableId || uuid();
  res.redirect(`/game/${tableId}`)
});

app.get('/game/:tableId', async (req, res) => {
  res.sendFile('build/index.html', {root: `${__dirname}/..`});
});

io.on('connection', async (socket) => {
  const tableId = socket.handshake.query.tableId;
  if (!tableId) return;
  console.log('User joined', tableId, socket.id);

  const store = await getStore(tableId);
  store.dispatch(join(socket.id));
  io.emit('updated_state', subjectiveState(store, socket.id));

  socket.on('dispatch', action => {
    console.log('User dispatched', tableId, socket.id, action);
    store.dispatch(action);
    io.emit('updated_state', subjectiveState(store, socket.id));
  });

  socket.on('disconnect', function(){
    console.log('User leaved', tableId, socket.id);
    store.dispatch(leave(socket.id));
    io.emit('updated_state', subjectiveState(store, socket.id));
  });
});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})