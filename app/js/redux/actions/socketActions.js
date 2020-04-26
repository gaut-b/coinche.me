import actionTypes from '../actionsTypes';
import socketEvents from '../../../../shared/constants/socketEvents';

export const subscribeServerUpdate = (tableId, username) => {
  return {
    type: actionTypes.RESET_LOCAL_GAME,
    listenSocketEvent: socketEvents.UPDATED_STATE,
    dispatchOnSocketEvent: actionTypes.UPDATED_SERVER_STATE,
    emit: socketEvents.JOIN,
    payload: {
      tableId,
      username,
    },
  }
}

export const unsubscribeServerUpdate = tableId => {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    stopListeningSocketEvent: socketEvents.UPDATED_STATE,
    emit: socketEvents.LEAVE,
    payload: {tableId},
  }
}

const buildSocketDispatchAction = (type, payload) => ({
  type: actionTypes.NO_LOCAL_EFFECT,
  emit: socketEvents.DISPATCH,
  payload: {
    action: {
      type,
      payload,
    }
  }
})

export const distribute = playerId =>
  buildSocketDispatchAction(actionTypes.DISTRIBUTE, {playerId})

export const swichTeams = indexes =>
  buildSocketDispatchAction(actionTypes.SWITCH_TEAMS, {indexes})

export const playCard = card =>
  buildSocketDispatchAction(actionTypes.PLAY_CARD, card)

export const getCardBack = card =>
  buildSocketDispatchAction(actionTypes.CARD_BACK, card)

export const collect = card =>
  buildSocketDispatchAction(actionTypes.COLLECT, {playerIndex})

export const newGame = () =>
  buildSocketDispatchAction(actionTypes.NEW_GAME, {})

export const undo = () =>
  buildSocketDispatchAction(actionTypes.UNDO, {})

export const declare = (playerId, declaration) =>
  buildSocketDispatchAction(actionTypes.DECLARE, {playerId, ...declaration})

export const launchGame = () =>
  buildSocketDispatchAction(actionTypes.LAUNCH_GAME, {})

export const getScore = () =>
  buildSocketDispatchAction(actionTypes.GET_SCORE, {})
