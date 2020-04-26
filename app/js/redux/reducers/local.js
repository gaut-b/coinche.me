import {localActionTypes} from '../actionsTypes';

const INITIAL_STATE = {
  isLastTrickVisible: false,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case localActionTypes.TOGGLE_IS_LAST_TRICK_VISIBLE:
      return {
        ...state,
        isLastTrickVisible: !state.isLastTrickVisible,
      }
    default:
      return state;
  };
};