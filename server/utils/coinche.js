import { DECK32 } from '../constants/decks';
import gameTypes from '../../shared/constants/gameType';
import gameScore from '../constants/gameScore';


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


export const countTrick = (trick, gameType, selectedTrump) => {
  return tricks.reduce((score, card) => {
    const [value, color] = [...card, card[card.length - 1];
    if (gameType !== gameTypes.STANDARD) {
      return score += gameScore[gameType][value];
    } else {
      const scoreType = (color === selectedTrump) ? 'trumpScore' : 'standardScore' ;
      return score += gameScore[gameType][scoreType][value]
    }
  }, 0)
};