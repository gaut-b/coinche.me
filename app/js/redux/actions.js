import actionTypes from './actionsTypes';
import socketEvents from '../../../shared/constants/socketEvents';

export function subscribeServerUpdate(tableId, username) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    listenSocketEvent: socketEvents.UPDATED_STATE,
    dispatchOnSocketEvent: actionTypes.UPDATED_SERVER_STATE,
    emit: socketEvents.JOIN,
    payload: {
      tableId,
      username,
    },
  }
}

export function unsubscribeServerUpdate(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    stopListeningSocketEvent: socketEvents.UPDATED_STATE,
    emit: socketEvents.LEAVE,
    payload: {tableId},
  }
}

export function distribute(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
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
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
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
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
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
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.COLLECT,
        payload: {playerId, cards}
      }
    }
  }
};
