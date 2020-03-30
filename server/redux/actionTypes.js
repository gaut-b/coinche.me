import sharedActionTypes from '../../shared/constants/actionsTypes';
export const actionTypes = {
  ...sharedActionTypes,
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
  // SWITCH_TEAMS: 'SWITCH_TEAMS',
  // DISTRIBUTE: 'DISTRIBUTE',
  // PLAY_CARD: 'PLAY_CARD',
  // COLLECT: 'COLLECT',
};

export default actionTypes;