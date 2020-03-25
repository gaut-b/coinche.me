export const ACTIONS = {
  DISTRIBUTE: 'DISTRIBUTE',
  PLAY_CARD: 'PLAY_CARD',
};

export function distribute() {
  return { type: ACTIONS.DISTRIBUTE }
}

export function playCard(card) {
  return {
    type: ACTIONS.PLAY_CARD,
    payload: card,
  }
}