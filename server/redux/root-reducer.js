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
    position: SOUTH,
    isDealer: true,
    hand: [],
    tricks: [],
  }, {
    name: 'Ouest',
    position: WEST,
    hand: [],
    tricks: [],
  }, {
    name: 'Nord',
    position: NORTH,
    hand: [],
    tricks: [],
  }, {
    name: 'Est',
    position: EAST,
    hand: [],
    tricks: [],
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
            ...{id: i === state.players.findIndex(p => !p.id) ? action.payload : null},
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
      return {
        ...state,
        ...{players}
      }
    // case actionTypes.PLAY_CARD: {
    //   const card = action.payload;
    //   const playerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
    //   const playerPosition = state.players[playerIndex].position;
    //   const playersUpdated = state.players.map((player) => {
    //     return Object.assign({}, player, {
    //       hand: player.hand.filter(c => c !== card),
    //     })
    //   });
    //   return Object.assign({}, state, {
    //     players: playersUpdated,
    //     onTable: state.onTable.filter(({position}) => position !== playerPosition).concat({
    //       value: card,
    //       position: playerPosition,
    //     })
    //   });
    // };
    // case actionTypes.COLLECT:
    //   const cards = action.payload; //It's not mandatory to pass cards as arguments because cards and state.onTable are equals
    //   if (!cards) return state;
    //   const playerIndex = state.players.findIndex(p => p.position === SOUTH);
    //   const playersUpdated = state.players.map((player, index) => {
    //     if (index === playerIndex) {
    //       cards.reverse().forEach( c => player.tricks.unshift(c.value))
    //     }
    //     return player;
    //   });
    //   return Object.assign({}, state, {
    //     players: playersUpdated,
    //     onTable: []
    //   });
    default:
      return state;
  };
};

export default rootReducer;



