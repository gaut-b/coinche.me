import { combineReducers } from 'redux';
import {
  DISTRIBUTE,
  PLAY_CARD,
} from './actions';
import {DECK32, DECK52} from '../constants/decks';
import {
  POSITIONS,
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';
import {shuffle} from '../utils/array';

const INITIAL_STATE = {
  deck: shuffle(DECK32),
  onTable: [],
  players: [{
    position: SOUTH,
    name: 'Me',
    hand: [],
    tricks: [],
    isFirstPerson: true,
  }, {
    position: WEST,
    name: 'Ennemi à abattre 1',
    hand: [],
    tricks: [],
    isVirtual: true,
    isDealer: true,
  }, {
    position: NORTH,
    name: 'Copaing',
    hand: [],
    tricks: [],
    isVirtual: true,
  }, {
    position: EAST,
    name: 'Ennemi à abattre 2',
    hand: [],
    tricks: [],
    isVirtual: true,
  }],
  score: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DISTRIBUTE:
      const dealerIndex = state.players.findIndex(p => p.isDealer);
      const nbPlayers = state.players.length;
      const playersWithHand = state.deck.reduce((players, card, deckIndex) => {
        const nextPlayerIndex = (dealerIndex + deckIndex) % nbPlayers;
        return players.map((player, playerIndex) => {
          if (nextPlayerIndex === playerIndex) {
            return Object.assign({}, player, {
              hand: player.hand.concat(card),
            })
          } else {
            return player;
          }
        })
      }, state.players);
      return Object.assign({}, state, {
        players: playersWithHand
      });
      case PLAY_CARD:
        const {card} = action;
        const playerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
        const playerPosition = state.players[playerIndex].position;
        const playersUpdated = state.players.map((player) => {
          return Object.assign({}, player, {
            hand: player.hand.filter(c => c !== card),
          })
        });
        return Object.assign({}, state, {
          players: playersUpdated,
          onTable: state.onTable.filter(({position}) => position !== playerPosition).concat({
            value: card,
            position: playerPosition,
          })
        });
    default:
      return state;
  };
};

export default rootReducer;