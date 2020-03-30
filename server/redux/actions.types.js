import sharedActionType from '../../shared/constants/actions.types';
export const actionTypes = {
  ...sharedActionType,
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
  // SWITCH_TEAMS: 'SWITCH_TEAMS',
  // DISTRIBUTE: 'DISTRIBUTE',
  // PLAY_CARD: 'PLAY_CARD',
  // COLLECT: 'COLLECT',
};

export default actionTypes;