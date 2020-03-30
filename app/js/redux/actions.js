import actionTypes from './actionsTypes';
import socketEvents from '../../../shared/constants/socketEvents';

export function subscribeServerUpdate(tableId, username) {
  return {
    type: 'server/join',
    event: socketEvents.UPDATED_STATE,
    handle: actionTypes.UPDATED_SERVER_STATE,
    emit: 'join',
    payload: {
      tableId,
      username,
    },
  }
}

export function unsubscribeServerUpdate(tableId) {
  console.log('unsubscribeServerUpdate called', tableId)
  return {
    type: 'server/leave',
    emit: 'leave',
    event: socketEvents.UPDATED_STATE,
    leave: true,
    payload: {tableId},
  }
}

export function distribute(tableId) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.DISTRIBUTE,
      }
    }
  }
}

export function swichTeams(tableId) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.SWITCH_TEAMS,
      }
    }
  }
}

export function playCard(tableId, card) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.PLAY_CARD,
        payload: card
      }
    }
  }
};

export function collect(tableId, playerId, cards) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.COLLECT,
        payload: {playerId, cards}
      }
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
