import { useEffect, useRef } from 'react';
const io = require('socket.io-client');

const useSocket = (...props) => {
  const { current: socket } = useRef(io(...props));
  useEffect(() => {
    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };
  }, [socket]);
  return [socket];
};

export default useSocket;