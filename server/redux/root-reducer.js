import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import { sortHand, distribute, distributeCoinche, cutDeck } from '../utils/coinche';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle, switchIndexes} from '../../shared/utils/array';


export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  tricks: [],
  players: [{
    hand: [],
  }, {
    hand: [],
  }, {
    hand: [],
  }, {
    hand: [],
  }],
  score: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.JOIN:
      const {playerId, playerName} = action.payload;
      const sameNamePlayerIndex = state.players.findIndex(p => p.name === playerName);
      const firstAvailableIndex = state.players.findIndex(p => !p.id);
      const newPlayerIndex = sameNamePlayerIndex === -1 ? firstAvailableIndex : sameNamePlayerIndex;
      return {
        ...state,
        players: state.players.map((p, i) => {
          if (newPlayerIndex === i) {
            return {
              ...p,
              id: playerId,
              name: playerName || p.name || `Joueur ${i+1}`,
              disconnected: false,
            }
          } else {
            return p;
          }
        })
      }
    case actionTypes.LEAVE:
      console.log('received leave')
      return {
        ...state,
        players: state.players.map(p => {
          return {
            ...p,
            disconnected: p.id === action.payload,
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

      // const playersWithCards = distribute(state.deck, playersWithDealer, dealerIndex);
      const playersWithCards = distributeCoinche(state.deck, playersWithDealer, dealerIndex);

      return {
        ...state,
        players: playersWithCards
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
              hand: sortHand(p.hand.filter(c => c !== card).concat(p.onTable || [])),
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

      const newTrick = {
        playerIndex,
        cards: state.players.map(p => p.onTable),
      };

      return {
        ...state,
        tricks: [newTrick, ...state.tricks],
        players: state.players.map((p, i) => {
          return {
            ...p,
            onTable: null,
          }
        })
      }
    };

    case actionTypes.NEW_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer)

      // A refactorer aussi, très moche !
      const tricks = state.players.map((p, index) => {
        return state.tricks.filter(({playerIndex}) => index === playerIndex)
          .reduce((tricks, trick) => tricks.concat(trick.cards), [])
      })

      // Rassemble les cartes en gardant les plis des équipes.
      // très moche, à refactorer
      const newDeck = cutDeck([].concat(tricks[0]).concat(tricks[2]).concat(tricks[1]).concat(tricks[3]));
      const resetedPlayers = state.players.map((p, index) => {
        return {
          ...p,
          hand: [],
          onTable: null,
          isDealer: (index === (dealerIndex + 1) % state.players.length),
        }
      });

      const newDealerIndex = state.players.findIndex(p => p.isDealer);
      const playersWithCards = distributeCoinche(newDeck, resetedPlayers, newDealerIndex);

      return {
        ...state,
        deck: newDeck,
        tricks: [],
        players: playersWithCards,
      };
    };

    default:
      return state;
  };
};

export default rootReducer;

