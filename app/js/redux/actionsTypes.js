import sharedActionTypes from '../../../shared/constants/actionsTypes';

const actionTypes = {
  ...sharedActionTypes,
  UPDATED_SERVER_STATE: 'UPDATED_SERVER_STATE',
  NO_LOCAL_EFFECT: 'NO_LOCAL_EFFECT',
  RESET_LOCAL_GAME: 'RESET_LOCAL_GAME',
};

export default actionTypes;