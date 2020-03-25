export const ACTIONS = {
  DISTRIBUTE: 'DISTRIBUTE',
  PLAY_CARD: 'PLAY_CARD',
  COLLECT: 'COLLECT',
};

export function distribute() {
  return { type: ACTIONS.DISTRIBUTE }
};

export function playCard(card) {
  return {
    type: ACTIONS.PLAY_CARD,
    payload: card,
  }
};

export function collect(cards) {
  return {
    type: ACTIONS.COLLECT,
    payload: cards
  }
};