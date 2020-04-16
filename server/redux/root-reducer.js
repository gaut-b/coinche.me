import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import { sortHand, distribute, distributeCoinche, cutDeck, countPlayerScore, hasBelote } from '../utils/coinche';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle, last, switchIndexes} from '../../shared/utils/array';


export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  isGameStarted: false,
  currentDeclaration: null,
  declarationsHistory: null,
  teams: [],
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
  score: null,
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
      const playersWithDealer = state.players.map((p, index) => ({
        ...p,
        hand: (p.hand.length) ? [] : p.hand,
        onTable: null,
        isDealer: p.id === dealerId,
        isActivePlayer: index === ((dealerIndex + 1) % state.players.length),
      }));

      const teams = (state.teams.length)
      ? (state.teams)
      : state.players.reduce((teams, p, index) => {
          teams[index % 2] = teams[index % 2] || {};
          teams[index % 2].players = teams[index % 2].players || [];
          teams[index % 2].players.push(p.id)
          return teams;
        }, [])

      // const playersWithCards = distribute(state.deck, playersWithDealer, dealerIndex);
      const playersWithCards = distributeCoinche(state.deck, playersWithDealer, dealerIndex);

      return {
        ...state,
        tricks: [],
        teams,
        players: playersWithCards
      };
    };
    case actionTypes.PLAY_CARD: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.hand.find(c => c === card));
      const trumpType = state.currentDeclaration.content.trumpType;
      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.filter(c => c !== card).concat(p.onTable || []), trumpType),
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
      const trumpType = state.currentDeclaration.content.trumpType;

      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.concat(card), trumpType),
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
        cards: state.players.map((_, index) => {
          return state.players[(playerIndex + index) % state.players.length].onTable
        }),
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
    case actionTypes.NEW_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer)

      // A refactorer aussi, très moche !
      const tricks = state.players.map((p, index) => {
        return state.tricks.filter(({playerIndex}) => index === playerIndex)
          .reduce((tricks, trick) => tricks.concat(trick.cards), [])
      })

      // Rassemble les cartes en gardant les plis des équipes.
      // très moche, à refactorer
      const newDeck = (tricks.length)
        ? [].concat(tricks[0]).concat(tricks[2]).concat(tricks[1]).concat(tricks[3])
        : state.deck;

      const resetedPlayers = state.players.map((p, index) => {
        return {
          ...p,
          hand: [],
          onTable: null,
          isDealer: (index === (dealerIndex + 1) % state.players.length),
        }
      });

      const updatedTeams = state.teams.map(team => {
        if (!team.currentGame) return team;
        team.totalScore = (team.totalScore || 0) + team.currentGame.gameTotal;
        team.currentGame = null;
        return team;
      });

      const newDealerIndex = state.players.findIndex(p => p.isDealer);
      const playersWithCards = distributeCoinche(newDeck, resetedPlayers, newDealerIndex);

      return {
        ...INITIAL_STATE,
        teams: updatedTeams,
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
      });

      const declarationsHistory = (state.declarationsHistory || []).concat({playerId, content: declaration.content});
      let currentDeclaration = (state.currentDeclaration)
      ? {...state.currentDeclaration}
      : {
        playerId: undefined,
        content: {},
      }

      if (declaration.type === 'DECLARE') {
        currentDeclaration = {
          playerId: playerId,
          content: declaration.content,
        }
      } else if (declaration.type === 'COINCHE') {
        currentDeclaration.isCoinched = (currentDeclaration.isCoinched || 0) + 2;
      };

      return {
        ...state,
        players: playersUpdated,
        declarationsHistory,
        currentDeclaration,
      };
    };
    case actionTypes.LAUNCH_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer);
      const trumpType = state.currentDeclaration.content.trumpType;
      const playersUpdated = state.players.map((p,i) => {
        return {
          ...p,
          hand: sortHand(p.hand, trumpType),
          hasBelote: hasBelote(p.hand, trumpType),
          isActivePlayer: (i === (dealerIndex + 1) % state.players.length),
        }
      })

      return {
        ...state,
        players: playersUpdated,
        isGameStarted: true,
      }
    };
    case actionTypes.GET_SCORE: {
      const currentDeclaration = state.currentDeclaration
      const allPlayerScore = countPlayerScore(state.tricks, state.currentDeclaration);

      const updatedTeams = state.teams.map( team => {
        team.currentGame = team.players.reduce((currentGame, playerId) => {
          const playerIndex = state.players.findIndex(p => p.id === playerId)
          const hasLastTen = (last(state.tricks).playerIndex === playerIndex);
          const playerScore = allPlayerScore[playerIndex] || 0;

          currentGame.gameScore = (currentGame.gameScore || 0) + playerScore;
          currentGame.hasBelote = (currentGame.hasBelote) || state.players[playerIndex].hasBelote;
          currentGame.hasLastTen = (currentGame.hasLastTen) || hasLastTen;
          currentGame.isBidderTeam = (currentGame.isBidderTeam) || (currentDeclaration.playerId === playerId);
          return currentGame;
        }, {});

        const lastTen = team.currentGame.hasLastTen ? 10 : 0;
        const belote = team.currentGame.hasBelote ? 20 : 0;
        const coef = (!currentDeclaration.isCoinched) ? 1 : currentDeclaration.isCoinched;
        const preTotal = team.currentGame.gameScore + lastTen;

        if (team.currentGame.isBidderTeam) {
          if (preTotal < 82) {
            team.currentGame.gameTotal = belote;
          } else if ((currentDeclaration.content.goal === 250) && (preTotal === 162)) {
            team.currentGame.gameTotal = 250 * coef + belote;
          } else if ((preTotal + belote) >= currentDeclaration.content.goal) {
            team.currentGame.gameTotal = currentDeclaration.content.goal * coef + belote;
          } else if ((preTotal + belote) < currentDeclaration.content.goal) {
            team.currentGame.gameTotal =  belote;
          }
        } else {
          if (currentDeclaration.content.goal === 250) {
            if (preTotal !== 0) team.currentGame.gameTotal = 162 * coef + belote;
            else team.currentGame.gameTotal = belote;
          } else if (preTotal <= (162 - currentDeclaration.content.goal)) {
            team.currentGame.gameTotal = preTotal + belote;
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

