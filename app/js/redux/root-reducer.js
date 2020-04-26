import actionTypes from './actionsTypes';

const INITIAL_STATE = {
  local: {},
  game: {},
}

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.UPDATED_SERVER_STATE:
      return {
        ...state,
        game: action.payload
      };
    case actionTypes.RESET_LOCAL_GAME:
      return {
        ...state,
        game: {}
      };
    default:
      return state;
  };
};

export default rootReducer;
