import { combineReducers } from 'redux';
import {DECK32, DECK52} from '../constants/decks';

const INITIAL_STATE = {
  deck: DECK32,
  onTable: [],
  players: [{
    name: 'Player One',
    hand: [],
    tricks: [],
    isFirstPerson: true,
  }, {
    name: 'Player two',
    hand: [],
    tricks: [],
    isVirtual: true,
  }, {
    name: 'Player three',
    hand: [],
    tricks: [],
    isVirtual: true,
  }, {
    name: 'Player four',
    hand: [],
    tricks: [],
    isVirtual: true,
  }],
  score: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  };
};

export default combineReducers({rootReducer});