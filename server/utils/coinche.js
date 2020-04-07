import { DECK32 } from '../constants/decks';

const ORDINARY = 'ORDINARY';
const ALL_TRUMP = 'ALL_TRUMP';
const NO_TRUMP = 'NO_TRUMP';

const trumpScore = {
  "J": 20,
  "9": 14,
  "A": 9,
  "10": 10,
  "K": 4,
  "Q": 3,
  "8": 0,
  "7": 0,
};

const ordinaryScore = {
  "A": 11,
  "10": 10,
  "K": 4,
  "Q": 3,
  "J": 2,
  "9": 0,
  "8": 0,
  "7": 0,
};

const allTrumpScore = {
  "J": 14,
  "9": 9,
  "A": 6,
  "10": 10,
  "K": 3,
  "Q": 2,
  "8": 0,
  "7": 0,
};

const noTrumpScore = {
  "A": 19,
  "10": 10,
  "K": 4,
  "Q": 3,
  "J": 2,
  "9": 0,
  "8": 0,
  "7": 0,
};

const gameScore = {
  ordinaryScore,
  trumpScore,
  allTrumpScore,
  noTrumpScore,
};

export const sortHand = (hand) => {
  const sortedSpades = hand.filter(c => c.includes('S')).sort();
  const sortedHearts = hand.filter(c => c.includes('H')).sort();
  const sortedClubs = hand.filter(c => c.includes('C')).sort();
  const sortedDiamonds = hand.filter(c => c.includes('D')).sort();

  return [].concat(sortedSpades).concat(sortedHearts).concat(sortedClubs).concat(sortedDiamonds);
}

export const distributeCoinche = (deck, players, dealerIndex) => {
  if (deck.length !== 32) return players;

  const newDeck = cutDeck(deck);
  let playersWithCards = distribute(newDeck.slice(0, 12), players, dealerIndex, 3);
  playersWithCards = distribute(newDeck.slice(12, 20), playersWithCards, dealerIndex, 2);
  playersWithCards = distribute(newDeck.slice(20, 32), playersWithCards, dealerIndex, 3);

  return playersWithCards;
};

export const distribute = (deck, players, dealerIndex, nbCardsToDistribute=1) => {

  let nextPlayerIndex = dealerIndex;
  const playersWithCards = deck.reduce((players, card, deckIndex) => {
    const nextPlayer = (nbCardsToDistribute === 1) || (deckIndex % nbCardsToDistribute === 0);
    if (nextPlayer) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }

    return players.map((player, playerIndex) => {
      if (nextPlayerIndex === playerIndex) {
        return {
          ...player,
          hand: player.hand.concat(card)
        }
      } else {
        return player;
      }
    })
  }, players);

  return playersWithCards.map(player => {
      return {
        ...player,
        hand: sortHand(player.hand),
      };
  });
};

export const cutDeck = (deck) => {
  const indexToCut = Math.floor(Math.random() * 24) + 4; //returns an integer betwenn 4 and 28
  const copiedDeck = [...deck];
  return [...deck.slice(indexToCut + 1, deck.length), ...deck.slice(0, indexToCut + 1)];
};

// export const sortColor = (color, trumpColor=[], gameScores) = {
//   if (!trumpColor.length) {
    
//   }
// };