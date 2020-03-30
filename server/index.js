import express from 'express';
import { v4 as uuid } from 'uuid';
import getStore from './redux/store';
import subjectiveState from './redux/subjectiveState';
import {emitEachInRoom} from '../shared/utils/sockets';
import {join, leave} from './redux/actions';
import socketEvents from '../shared/constants/socketEvents';

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

const dispatchActionAndBroadcastNewState = async (tableId, action) => {
  console.log(`Action on table ${tableId}`, action)
  const store = await getStore(tableId);
  store.dispatch(action);
  return emitEachInRoom(io, tableId, socketEvents.UPDATED_STATE, clientId => subjectiveState(store.getState(), clientId));
}

try {
  io.on('connection', socket => {
    console.log('new connection', socket.id)

    socket.on('join', async ({tableId, username}) => {
      socket.join(tableId);
      dispatchActionAndBroadcastNewState(tableId, join({playerId: socket.id, playerName: username}))
    })

    socket.on('dispatch', async ({tableId, action}) => {
      dispatchActionAndBroadcastNewState(tableId, action)
    });

    socket.on('leave', async ({tableId}) => {
      socket.disconnect();
      dispatchActionAndBroadcastNewState(tableId, leave(socket.id))
    });
  });
} catch(e) {
  console.error('Socket error:')
  console.error(e);
}


server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})