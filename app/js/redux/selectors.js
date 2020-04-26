import get from 'lodash.get';
import { createSelector } from 'reselect';
import {SOUTH} from '../../../shared/constants/positions';
import {last} from '../../../shared/utils/array';

export const selectPlayers = state => get(state, 'game.players', []);
export const selectTricks = state => get(state, 'game.tricks', []);
export const selectDeck = state => get(state, 'game.deck', []);
export const selectDeclarationsHistory = state => get(state, 'game.declarationsHistory', []);
export const selectIsGameStarted = state => get(state, 'game.isGameStarted');
export const selectScore = state => get(state, 'game.score', []);
export const selectTeams = state => get(state, 'game.teams', []);

export const selectNbPlayers = createSelector(
  [selectPlayers],
  (players) => players.length,
);

export const selectPlayerByPosition = createSelector(
  [selectPlayers],
  players => position => players.find(player => player.position === position)
)

export const selectCurrentPlayer = createSelector(
  [selectPlayers],
  (players) => players.find(player => player.position === SOUTH)
);

export const selectIsDistributed = createSelector(
  [selectPlayers],
  players => players.filter(p => ((p.hand || []).length)).length
);

export const selectIsLastTrick = createSelector(
  [selectDeck, selectPlayers, selectTricks],
  (deck, players, tricks) => (tricks.length * players.length) === deck.length,
);

export const selectHumanPlayers = createSelector(
  [selectPlayers],
  players => players.filter(p => p.id)
);

export const selectOnTable = createSelector(
  [selectPlayers],
  players => players.filter(p => p.onTable).map(p => ({value: p.onTable, position: p.position}))
);

export const selectCanCollect = createSelector(
  [selectPlayers, selectOnTable],
  (players, onTable) => onTable.length === players.length,
);

export const selectLastTrick = createSelector(
  [selectTricks],
  (tricks) => tricks[0],
);

export const selectActivePlayer = createSelector(
  [selectPlayers],
  players => players.find(p => p.isActivePlayer),
);

export const selectIsActivePlayer = createSelector(
  [selectCurrentPlayer],
  (player) => {
    if (!player) return false;
    return player.isActivePlayer;
  },
);

export const selectActivePlayerName = createSelector(
  [selectPlayers],
  (players) => {
    const activePlayer = players.find(p => p.isActivePlayer)
    if (activePlayer) return activePlayer.name;
  },
);

export const selectLastMasterIndex = createSelector(
  [selectLastTrick],
  lastTrick => lastTrick.playerIndex,
);

export const selectPartnerId = createSelector(
  [selectCurrentPlayer, selectTeams],
  (currentPlayer, teams) => {
    const team = teams.find(team => team.players.includes(currentPlayer.id))
    return team.players.find(playerId => playerId !== currentPlayer.id)
  },
);

export const selectCurrentDeclaration = createSelector(
  [selectDeclarationsHistory],
  (declarationsHistory) => last(declarationsHistory.filter(d => (d.type !== declarationTypes.PASS) && (d.type !== declarationTypes.COINCHE)))
)

export const selectIsCoinched = createSelector(
	[selectDeclarationsHistory],
	(declarationsHistory) => declarationsHistory.filter(d => d.type === declarationTypes.COINCHE),
);
