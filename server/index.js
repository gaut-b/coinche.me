import express from 'express';
import { v4 as uuid } from 'uuid';
import getStore from './redux/store';
import broadcastSubjectiveState from './redux/broadcastSubjectiveState';
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

try {
  io.on('connection', socket => {
    console.log('new connection', socket.id)
    // const tableId = socket.handshake.query.tableId;
    // if (!tableId) return;
    // console.log('User joined', tableId, socket.id);

    socket.on('join', async ({tableId}) => {
      console.log('received connect', tableId, socket.id)
      socket.join(tableId);
      const store = await getStore(tableId);
      store.dispatch(join(socket.id));
      io.emit('updated_state', store.getState());
      broadcastSubjectiveState(tableId, socket.id, io, store)
    })

    socket.on('dispatch', async ({tableId, action}) => {
      console.log('User dispatched', socket.id, tableId, action);
      const store = await getStore(tableId);
      store.dispatch(action);
      broadcastSubjectiveState(tableId, socket.id, io, store);
    });

    socket.on('disconnect', async ({tableId}) => {
      console.log('User leaved', socket.id, tableId);
      const store = await getStore(tableId);
      store.dispatch(leave(socket.id));
      broadcastSubjectiveState(tableId, socket.id, io, store);
    });
  });
} catch(e) {
  console.error('Socket error:')
  console.error(e);
}


server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})