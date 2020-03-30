import { combineReducers } from 'redux';
import actionTypes from './actions.types';
import {DECK32, DECK52} from '../constants/decks';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle} from '../../shared/utils/array';

export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  onTable: [],
  players: [{
    name: 'Sud',
    position: null,
    isDealer: true,
    hand: [],
    tricks: [],
    id: null,
  }, {
    name: 'Ouest',
    position: null,
    hand: [],
    tricks: [],
    id: null,
  }, {
    name: 'Nord',
    position: null,
    hand: [],
    tricks: [],
    id: null,
  }, {
    name: 'Est',
    position: null,
    hand: [],
    tricks: [],
    id: null,
  }],
  score: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.JOIN:
      return {
        ...state,
        players: state.players.map((p, i) => {
          return {
            ...p,
            ...{id: i === state.players.findIndex(p => !p.id) ? action.payload : p.id},
          }
        })
      }
    case actionTypes.LEAVE:
      return {
        ...state,
        players: state.players.map(p => {
          return {
            ...p,
            ...{
              id: p.id !== action.payload ? p.id : null,
            }
          }
        })
      }
    case actionTypes.DISTRIBUTE: {
      const dealerIndex = state.players.findIndex(p => p.isDealer);
      const players = state.deck.reduce((players, card, deckIndex) => {
        const nextPlayerIndex = (dealerIndex + deckIndex) % state.players.length;
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
      }, state.players);

      const sortedPlayers = players.map((player) => {
        const sortedHand = sortHand(player.hand);
        return {
          ...player,
          hand: sortedHand,
        };
      });

      return {
        ...state,
        players: sortedPlayers,
      };
    }
    case actionTypes.PLAY_CARD: {
      const card = action.payload;
      const playerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
      const playerPosition = state.players[playerIndex].position;
      const playerName = state.players[playerIndex].name;

      // Checking if the user has already played a card
      const playedCardIndex = state.onTable.findIndex(cards => cards.playerName === playerName)
      const updatedPlayedCards = (playedCardIndex === -1) ? state.onTable : state.onTable.filter((_, index) => index !== playedCardIndex);
      const playedCard = (playedCardIndex === -1) ? null : state.onTable[playedCardIndex];

      const playersUpdated = state.players.map((player, index) => {
        let updatedHand;
        if ((index === playerIndex) && (playedCard)) {
          player.hand.push(playedCard.value);
          updatedHand = sortHand(player.hand).filter(c => c !== card);
        } else {
          updatedHand = player.hand.filter(c => c !== card);
        }

        return {
          ...player,
          hand: updatedHand,
        }
      });

      return {
        ...state,
        players: playersUpdated,
        onTable: [
          ...updatedPlayedCards,
          {
            value: card,
            playerName: playerName,
            position: playerPosition,
          },
        ],
      };
    };
    case actionTypes.COLLECT: {
      const {playerId, cards} = action.payload; //It's not mandatory to pass cards as arguments because cards and state.onTable are equals
      if (!cards) return state;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      console.log('playerIndex', playerIndex)
      const playersUpdated = state.players.map((player, index) => {
        if (index === playerIndex) {
          cards.reverse().forEach( c => player.tricks.unshift(c.value))
        }
        return player;
      });
      return {
        ...state,
        players: playersUpdated,
        onTable: []
      };
    };

    default:
      return state;
  };
};

const sortHand = (hand) => {
  const sortedSpades = hand.filter(c => c.includes('S')).sort();
  const sortedHearts = hand.filter(c => c.includes('H')).sort();
  const sortedClubs = hand.filter(c => c.includes('C')).sort();
  const sortedDiamonds = hand.filter(c => c.includes('D')).sort();

  return [].concat(sortedSpades).concat(sortedHearts).concat(sortedClubs).concat(sortedDiamonds);
}

export default rootReducer;



