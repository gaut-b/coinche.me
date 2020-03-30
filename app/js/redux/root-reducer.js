import actionTypes from './actionsTypes';

const INITIAL_STATE = {
  deck: null,
  onTable: [],
  players: [],
}

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.UPDATED_SERVER_STATE:
      return action.payload;
    default:
      return state;
  };
};

export default rootReducer;
