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

    if (leave) {
      socket.removeListener(event);
    }

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

    return next(action);
  };
}