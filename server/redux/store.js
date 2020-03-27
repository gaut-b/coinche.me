import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './root-reducer';
import redisInstance, {redisKey} from '../redis';


const storeToRedis = store => next => action => {
  next(action);
  return redisInstance.set(redisKey, store.getState()).then(v => console.log(v))
}

const middlewares = [storeToRedis];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;