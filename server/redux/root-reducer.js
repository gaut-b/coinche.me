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
    case actionTypes.DISTRIBUTE:
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

      const playerSortedHands = players.map((player) => {
        const sortedSpades = player.hand.filter(c => c.includes('S')).sort();
        const sortedHearts = player.hand.filter(c => c.includes('H')).sort();
        const sortedClubs = player.hand.filter(c => c.includes('C')).sort();
        const sortedDiamonds = player.hand.filter(c => c.includes('D')).sort();

        const sortedHand = [].concat(sortedSpades).concat(sortedHearts).concat(sortedClubs).concat(sortedDiamonds);

        return {
          ...player,
          hand: sortedHand,
        };
      });

      return {
        ...state,
        players: playerSortedHands
      };
    case actionTypes.PLAY_CARD: {
      const card = action.payload;

      // For now, all players doesn't have id's, but it'll be faster to check id than cards
      // const playerIndex = state.players.findIndex(p => p.id === playerId);
      const playerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
      const playerPosition = state.players[playerIndex].position;
      const playerName = state.players[playerIndex].name;
      const playersUpdated = state.players.map((player) => {
        return {
          ...player,
          hand: player.hand.filter(c => c !== card),
        }
      });

      return {
        ...state,
        players: playersUpdated,
        onTable: [
          ...state.onTable,
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

export default rootReducer;



