import {last} from '../../../shared/utils/array';
import io from 'socket.io-client';

export default function socketMiddleware() {
  const socket = io.connect('');

  return ({ dispatch }) => next => (action) => {
    console.log('coucou received', action)
    if (typeof action === 'function') {
      return next(action);
    }

    const { event, leave, handle, emit, payload, ...rest } = action;

    if (leave) {
      socket.removeListener(event);
    }

    if (handle) {
      const handleCallback = typeof handle === 'string' ? (result => dispatch({ type: handle, result, ...rest })) : handle
      socket.on(event, result => {
        console.log('received', result)
        handleCallback(result)
      });
    }

    if (emit) {
      console.log('emitting', emit, payload, socket.id)
      socket.emit(emit, payload);
    }

    return next(action);
  };
}