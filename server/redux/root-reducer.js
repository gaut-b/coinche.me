import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import { sortHand, distribute, distributeCoinche, cutDeck } from '../utils/coinche';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle, switchIndexes} from '../../shared/utils/array';


export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  isGameStarted: false,
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
    };
    case actionTypes.DISTRIBUTE: {
      const dealerId = action.payload.playerId;
      const dealerIndex = state.players.findIndex(p => p.id === dealerId);
      console.log(dealerIndex)
      const playersWithDealer = state.players.map((p, index) => ({
        ...p,
        hand: (p.hand.length) ? [] : p.hand,
        onTable: null,
        isDealer: p.id === dealerId,
        isActivePlayer: index === ((dealerIndex + 1) % state.players.length),
      }));

      // const playersWithCards = distribute(state.deck, playersWithDealer, dealerIndex);
      const playersWithCards = distributeCoinche(state.deck, playersWithDealer, dealerIndex);

      return {
        ...state,
        tricks: [],
        players: playersWithCards
      };
    };
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
              isActivePlayer: false,
            }
          } else {
            return {
              ...p,
              isActivePlayer: i === ((playingPlayerIndex + 1) % state.players.length),
            }
          }
        }),
      }
    };
    case actionTypes.CARD_BACK: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.onTable === card);

      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.concat(card)),
              onTable: null,
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
            isActivePlayer: i === playerIndex,
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
      const newDeck = [].concat(tricks[0]).concat(tricks[2]).concat(tricks[1]).concat(tricks[3]);
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
        isGameStarted: false,
        deck: newDeck,
        tricks: [],
        players: playersWithCards,
      };
    };
    case actionTypes.DECLARE: {
      const {playerId, declaration} = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);

      const playersUpdated = state.players.map((p, i) => {
        return {
          ...p,
          isActivePlayer: (i === (playerIndex + 1) % state.players.length),
        }
      })

      if (declaration.type === 'PASS') {
        return {
          ...state,
          players: playersUpdated,
          declarationsHistory: (state.declarationsHistory || []).concat({playerId, content: {}}),
        };
      } else if (declaration.type === 'DECLARE') {
        return {
          ...state,
          players: playersUpdated,
          declarationsHistory: (state.declarationsHistory || []).concat({playerId, content: declaration.content}),
          currentDeclaration: {
            playerId,
            content: declaration.content,
          }
        };
      };

      return state;
    };
    case actionTypes.LAUNCH_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer);
      const playersUpdated = state.players.map((p,i) => {
        return {
          ...p,
          isActivePlayer: (i === (dealerIndex + 1) % state.players.length),
        }
      })

      return {
        ...state,
        players: playersUpdated,
        isGameStarted: true,
      }
    };
    default:
      return state;
  };
};

export default rootReducer;

