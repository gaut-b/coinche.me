import actionTypes from './actions.types';

export function subscribeServerUpdate() {
  return {
    event: 'updated_state',
    handle: actionTypes.UPDATED_SERVER_STATE,
  }
}

export function unsubscribeServerUpdate() {
  return {
    event: 'updated_state',
    leave: true,
  }
}

export function distribute() {
  return {
    event: 'dispatch',
    emit: true,
    payload: {
      type: 'DISTRIBUTE',
    }
  }
}

export function playCard(playerId, card) {
  return {
    event: 'dispatch',
    emit: true,
    payload: {
      type: 'PLAY_CARD',
      payload: {playerId, card}
    }
  }
};

// // Action creator with received function:
// export function subscribeConversation() {
//   return dispatch => dispatch({
//     event: 'message',
//     handle: data => dispatch({
//       type: actionTypes.NEW_MESSAGE,
//       payload: data.message,
//     }),
//   });
// }
