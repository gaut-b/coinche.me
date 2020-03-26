import actionTypes from './actions.types';

export function distribute() {
  return { type: actionTypes.DISTRIBUTE }
};

export function playCard(card) {
  return {
    type: actionTypes.PLAY_CARD,
    payload: card,
  }
};

export function collect(cards) {
  return {
    type: actionTypes.COLLECT,
    payload: cards
  }
};