import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import { sortHand, distribute, distributeCoinche, cutDeck, countPlayerScore, hasBelote } from '../utils/coinche';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import options from '../../shared/constants/options';
import {shuffle, first, next, nextIndex, last, switchIndexes, partition} from '../../shared/utils/array';
import {
  selectCurrentDeclaration,
  selectIsCoinched,
  selectCurrentTrumpType,
  selectTeams,
} from './selectors';

export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  hasGameStarted: false,
  declarationsHistory: [],
  tricks: [],
  players: Array(4).fill({
    name: null,
    id: null,
    hand: [],
    sockets: [],
    disconnected: false,
  }),
  preferences: {
    declarationMode: options.NO_DECLARATION,
  },
  score: [
    [0, 0],
    [120, 0],
  ],
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.JOIN:
      const {playerId, playerName, socketId} = action.payload;
      const samePlayerIndex = state.players.findIndex(p => p.id === playerId);
      const firstAvailableIndex = state.players.findIndex(p => !p.id);
      const firstDisconnectedIndex = state.players.findIndex(p => p.disconnected);
      const newPlayerIndex = [samePlayerIndex, firstAvailableIndex, firstDisconnectedIndex].find(i => i > -1);
      if (newPlayerIndex === undefined) return state;
      return {
        ...state,
        players: state.players.map((p, i) => {
          if (newPlayerIndex === i) {
            return {
              ...p,
              id: playerId,
              name: playerName || p.name || `Joueur ${i+1}`,
              sockets: p.sockets.concat(socketId),
              disconnected: false,
            }
          } else {
            return p;
          }
        })
      }
    case actionTypes.LEAVE:
      return {
        ...state,
        players: state.players.map(p => {
          const filteredSockets = p.sockets.filter(s => s !== action.payload);
          return {
            ...p,
            sockets: filteredSockets,
            disconnected: p.id && filteredSockets.length === 0,
          }
        })
      }
    case actionTypes.SWITCH_TEAMS: {
      const [i1, i2] = action.payload.indexes;
      const i1PartnerIndex = state.players.findIndex((p, i) => {
        return i !== i1 && (i % 2) === (i1 % 2);
      });
      return {
        ...state,
        players: switchIndexes(state.players, i1PartnerIndex, i2),
      }
    };
    case actionTypes.DISTRIBUTE: {
      const dealerId = action.payload.playerId;
      const dealerIndex = state.players.findIndex(p => p.id === dealerId);
      const activePlayerIndex = nextIndex(state.players, dealerIndex);
      const playersWithDealer = state.players.map((p, index) => ({
        ...p,
        hand: (p.hand.length) ? [] : p.hand,
        onTable: null,
        isDealer: index === dealerIndex,
        isActivePlayer: index === activePlayerIndex,
      }));

      // const teams = (state.teams.length)
      // ? (state.teams)
      // : partition(state.players.map(p => p.id), (p, i) => i%2).map(players => ({
      //   players,
      // }))

      const playersWithCards = distributeCoinche(state.deck, playersWithDealer, dealerIndex);

      return {
        ...state,
        tricks: [],
        // teams,
        players: playersWithCards,
        hasGameStarted: state.preferences.declarationMode === options.NO_DECLARATION,
      };
    };
    case actionTypes.PLAY_CARD: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
      const activePlayerIndex = nextIndex(state.players, playingPlayerIndex);
      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.filter(c => c !== card).concat(p.onTable || []), selectCurrentTrumpType(state)),
              onTable: card,
              isActivePlayer: false,
            }
          } else {
            return {
              ...p,
              isActivePlayer: i === activePlayerIndex,
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
              hand: sortHand(p.hand.concat(card), selectCurrentTrumpType(state)),
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
        cards: state.players.map(p => p.onTable).filter(c => c),
      };
      if (newTrick.cards.length < state.players.length) {
        return state;
      }
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
    // DEPRECATED use DISTRIBUTE instead
    case actionTypes.NEW_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer)
      const newDealerIndex = nextIndex(state.players, dealerIndex);
      const newActivePlayerIndex = nextIndex(state.players, newDealerIndex);

      // A refactorer aussi, très moche !
      const tricks = state.players.map((p, index) => {
        return state.tricks.filter(({playerIndex}) => index === playerIndex)
          .reduce((tricks, trick) => tricks.concat(trick.cards), [])
      })

      // Rassemble les cartes en gardant les plis des équipes.
      // très moche, à refactorer
      const newDeck = (!tricks.length)
        ? [].concat(tricks[0]).concat(tricks[2]).concat(tricks[1]).concat(tricks[3])
        : state.deck;

      const resetedPlayers = state.players.map((p, index) => {
        return {
          ...p,
          hand: [],
          onTable: null,
          isDealer: index === newDealerIndex,
          isActivePlayer: index === newActivePlayerIndex,
        }
      });

      // const updatedTeams = state.teams.map(team => {
      //   if (!team.currentGame) return team;
      //   team.totalScore = (team.totalScore || 0) + team.currentGame.gameTotal;
      //   team.currentGame = null;
      //   return team;
      // });
      const playersWithCards = distributeCoinche(newDeck, resetedPlayers, newDealerIndex);

      return {
        ...INITIAL_STATE,
        // teams: updatedTeams,
        hasGameStarted: false,
        deck: newDeck,
        tricks: [],
        players: playersWithCards,
      };
    };
    case actionTypes.DECLARE: {
      const {playerId, trumpType, goal, type} = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);

      const playersUpdated = state.players.map((p, i) => {
        return {
          ...p,
          isActivePlayer: (i === (playerIndex + 1) % state.players.length),
        }
      });

      return {
        ...state,
        players: playersUpdated,
        declarationsHistory: state.declarationsHistory.concat({
          playerId,
          trumpType,
          goal,
          type,
        }),
      };
    };
    case actionTypes.LAUNCH_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer);
      const trumpType = selectCurrentTrumpType(state);
      const playersUpdated = state.players.map((p,i) => {
        return {
          ...p,
          hand: sortHand(p.hand, trumpType),
          hasBelote: hasBelote(p.hand, trumpType),
          isActivePlayer: i === nextIndex(state.players, dealerIndex),
        }
      })

      return {
        ...state,
        players: playersUpdated,
        hasGameStarted: true,
      }
    };
    case actionTypes.GET_SCORE: {
      const currentDeclaration = selectCurrentDeclaration(state);
      const allPlayerScore = countPlayerScore(state.tricks, currentDeclaration.trumpType);
      const isCoinched = selectIsCoinched(state);

      const updatedTeams = selectTeams(state).map( team => {
        team.currentGame = team.players.reduce((currentGame, playerId) => {
          const playerIndex = state.players.findIndex(p => p.id === playerId)
          const hasLastTen = (first(state.tricks).playerIndex === playerIndex);
          const playerScore = allPlayerScore[playerIndex] || 0;

          currentGame.gameScore = (currentGame.gameScore || 0) + playerScore;
          currentGame.hasBelote = (currentGame.hasBelote) || state.players[playerIndex].hasBelote;
          currentGame.hasLastTen = (currentGame.hasLastTen) || hasLastTen;
          currentGame.isBidderTeam = (currentGame.isBidderTeam) || (currentDeclaration.playerId === playerId);
          currentGame.isCoinched = (currentGame.isCoinched) || `${(isCoinched.length >= 2) ? 'Surcoinchée' : ((isCoinched.length === 1) ? 'Coinchée' : '')}`;
          return currentGame;
        }, {});

        const lastTen = team.currentGame.hasLastTen ? 10 : 0;
        const belote = team.currentGame.hasBelote ? 20 : 0;
        const coef = (isCoinched.length) ? isCoinched.length * 2 : 1;
        const preTotal = team.currentGame.gameScore + lastTen;

        if (team.currentGame.isBidderTeam) {
          if (preTotal < 82) {
            team.currentGame.gameTotal = belote;
          } else if ((currentDeclaration.goal === 250) && (preTotal === 162)) {
            team.currentGame.gameTotal = 250 * coef + belote;
          } else if ((preTotal + belote) >= currentDeclaration.goal) {
            team.currentGame.gameTotal = currentDeclaration.goal * coef + belote;
          } else if ((preTotal + belote) < currentDeclaration.goal) {
            team.currentGame.gameTotal =  belote;
          }
        } else {
          if (currentDeclaration.goal === 250) {
            if (preTotal !== 0) team.currentGame.gameTotal = 250 * coef + belote;
            else team.currentGame.gameTotal = belote;
          } else if (preTotal <= (162 - currentDeclaration.goal)) {
            team.currentGame.gameTotal = belote;
          } else {
            team.currentGame.gameTotal = 162 * coef + belote;
          }
        }
        return team;
      });

      return {
        ...state,
        teams: updatedTeams,
      }
    };
    default:
      return state;
  };
};

export default rootReducer;

