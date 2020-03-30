import {last} from '../../../shared/utils/array';
import io from 'socket.io-client';

export default function socketMiddleware() {
  const socket = io.connect('');

  return ({ dispatch }) => next => (action) => {
    console.log('SocketMiddleware', action)
    if (typeof action === 'function') {
      return next(action);
    }

    const { event, leave, handle, emit, payload, ...rest } = action;

    if (handle) {
      const handleCallback = typeof handle === 'string' ? (result => {
        dispatch({ type: handle, result })
      }) : handle
      socket.on(event, result => {
        handleCallback(result)
      });
    }

    if (emit) {
      socket.emit(emit, payload);
    }

    if (leave) {
      socket.removeListener(event);
    }

    return next(action);
  };
}