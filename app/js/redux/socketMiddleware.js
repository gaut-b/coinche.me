import {last} from '../../../shared/utils/array';
import io from 'socket.io-client';

export default function socketMiddleware() {
  const socket = io.connect('');

  return ({ dispatch }) => next => (action) => {
    if (typeof action === 'function') {
      return next(action);
    }

    const { listenSocketEvent, stopListeningSocketEvent, dispatchOnSocketEvent, emit, payload: actionPayload } = action;

    if (listenSocketEvent && dispatchOnSocketEvent) {
      socket.on(listenSocketEvent, socketPayload => {
        dispatch({ type: dispatchOnSocketEvent, payload: socketPayload })
      });
    }

    if (emit) {
      socket.emit(emit, actionPayload);
    }

    if (stopListeningSocketEvent) {
      socket.removeListener(stopListeningSocketEvent);
    }

    return next(action);
  };
}