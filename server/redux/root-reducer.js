import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle, switchIndexes} from '../../shared/utils/array';

export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  players: [{
    hand: [],
    tricks: [],
  }, {
    hand: [],
    tricks: [],
  }, {
    hand: [],
    tricks: [],
  }, {
    hand: [],
    tricks: [],
  }],
  score: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.JOIN:
      const newPlayerIndex = state.players.findIndex(p => !p.id);
      const {playerId, playerName} = action.payload;
      return {
        ...state,
        players: state.players.map((p, i) => {
          return {
            ...p,
            id: i === newPlayerIndex ? playerId : p.id,
            name: i === newPlayerIndex && playerName || p.name,
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
    case actionTypes.SWITCH_TEAMS: {
      const switchedPlayers = switchIndexes(state.players, 1, 2);
      return {
        ...state,
        players: switchedPlayers,
      }
    }
    case actionTypes.DISTRIBUTE: {
      const dealerId = action.payload.playerId;
      const dealerIndex = state.players.findIndex(p => p.id === dealerId);
      const playersWithDealer = state.players.map(p => ({
        ...p,
        isDealer: p.id === dealerId,
      }));
      const playersWithCards = state.deck.reduce((players, card, deckIndex) => {
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
      }, playersWithDealer);

      const playersWithSortedCards = playersWithCards.map(player => {
        return {
          ...player,
          hand: sortHand(player.hand),
        };
      });

      return {
        ...state,
        players: playersWithSortedCards,
      };
    }
    case actionTypes.PLAY_CARD: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.hand.find(c => c === card));

      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: p.hand.filter(c => c !== card),
              onTable: card,
            }
          } else {
            return p;
          }
        }),
      }
    };
    case actionTypes.COLLECT: {
      const {playerIndex} = action.payload;

      return {
        ...state,
        players: state.players.map((p, i) => {
          return {
            ...p,
            onTable: null,
            tricks: i === playerIndex ? p.tricks.concat([state.players.map(_p => _p.onTable)]) : p.tricks,
          }
        })
      }

      // const playerIndex = state.players.findIndex(p => p.id === playerId);
      // const playersUpdated = state.players.map((player, index) => {
      //   if (index === playerIndex) {
      //     cards.reverse().forEach( c => player.tricks.unshift(c.value))
      //   }
      //   return player;
      // });
      // return {
      //   ...state,
      //   players: playersUpdated,
      //   onTable: []
      // };
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



