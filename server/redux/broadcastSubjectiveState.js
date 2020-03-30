import subjectiveState from './subjectiveState';
import {emitEachInRoom} from '../../shared/utils/sockets';

const broadcastSubjectiveState = (io, tableId, state) => {
  if (!tableId) return state;
  return emitEachInRoom(io, tableId, 'updated_state', clientId => subjectiveState(state, clientId));
};

export default broadcastSubjectiveState;
