import {combineReducers} from 'redux';

import game from './reducers/game';
import local from './reducers/local';

export default combineReducers({
  game,
  local,
});
