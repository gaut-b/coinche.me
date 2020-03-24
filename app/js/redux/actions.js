export const DISTRIBUTE = 'DISTRIBUTE'
export const PLAY_CARD = 'PLAY_CARD'

export function distribute() {
  return { type: DISTRIBUTE }
}

export function playCard(card) {
  return {
    type: PLAY_CARD,
    card,
  }
}