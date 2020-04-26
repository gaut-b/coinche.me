import {localActionTypes} from '../actionsTypes';

export const toggleIsLastTrickVisible = () => {
  return {
    type: localActionTypes.TOGGLE_IS_LAST_TRICK_VISIBLE,
    payload: {},
  }
}