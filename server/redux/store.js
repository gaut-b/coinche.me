import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer, {INITIAL_STATE} from './root-reducer';

const Redis = require('ioredis');
const redisURL = "redis://redis";
const redisInstance = new Redis(redisURL);

const checkRedisStateCorrectness = (redisState) => {
  // TODO: check if players: [], deck: [], onTable: [] are present
  return redisState;
}

const getStore = async redisKey => {
  const storeToRedis = store => next => action => {
    next(action);
    return redisInstance.set(redisKey, JSON.stringify(store.getState()))
  }

  const middlewares = [storeToRedis].concat(process.env.NODE_ENV === 'development' ? logger : []);

  const redisStateString = await redisInstance.get(redisKey);
  const redisState = JSON.parse(redisStateString);
  const initialStoreState = checkRedisStateCorrectness(redisState) || INITIAL_STATE;
  return createStore(rootReducer, initialStoreState, applyMiddleware(...middlewares));
}

export default getStore;