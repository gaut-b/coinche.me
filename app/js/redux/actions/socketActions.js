import {socketActionTypes} from '../actionsTypes';
import gameActionTypes from '../../../../shared/constants/actionsTypes';
import socketEvents from '../../../../shared/constants/socketEvents';

export const subscribeServerUpdate = (tableId, username) => {
  return {
    type: socketActionTypes.RESET_LOCAL_GAME,
    listenSocketEvent: socketEvents.UPDATED_STATE,
    dispatchOnSocketEvent: socketActionTypes.UPDATED_SERVER_STATE,
    emit: socketEvents.JOIN,
    payload: {
      tableId,
      username,
    },
  }
}

export const unsubscribeServerUpdate = tableId => {
  return {
    type: socketActionTypes.NO_LOCAL_EFFECT,
    stopListeningSocketEvent: socketEvents.UPDATED_STATE,
    emit: socketEvents.LEAVE,
    payload: {tableId},
  }
}

const buildSocketDispatchAction = (type, payload) => ({
  type: socketActionTypes.NO_LOCAL_EFFECT,
  emit: socketEvents.DISPATCH,
  payload: {
    action: {
      type,
      payload,
    }
  }
})

export const distribute = playerIndex =>
  buildSocketDispatchAction(gameActionTypes.DISTRIBUTE, {playerIndex})

export const swichTeams = indexes =>
  buildSocketDispatchAction(gameActionTypes.SWITCH_TEAMS, {indexes})

export const playCard = card =>
  buildSocketDispatchAction(gameActionTypes.PLAY_CARD, card)

export const getCardBack = card =>
  buildSocketDispatchAction(gameActionTypes.CARD_BACK, card)

export const collect = playerIndex =>
  buildSocketDispatchAction(gameActionTypes.COLLECT, {playerIndex})

export const newGame = () =>
  buildSocketDispatchAction(gameActionTypes.NEW_GAME, {})

export const undo = () =>
  buildSocketDispatchAction(gameActionTypes.UNDO, {})

export const declare = (playerId, declaration) =>
  buildSocketDispatchAction(gameActionTypes.DECLARE, {playerId, ...declaration})

export const launchGame = () =>
  buildSocketDispatchAction(gameActionTypes.LAUNCH_GAME, {})

export const getScore = () =>
  buildSocketDispatchAction(gameActionTypes.GET_SCORE, {})
