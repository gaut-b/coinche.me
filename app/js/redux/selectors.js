import { createSelector } from 'reselect';
import {SOUTH} from '../../../shared/constants/positions';

const selectPlayers = state => state.players;

export const selectCurrentPlayer = createSelector(
  [selectPlayers],
  (players) => players.find(player => player.position === SOUTH)
);

export const selectIsDistributed = createSelector(
  [selectPlayers],
  players => players.filter(p => ((p.hand || []).length)).length
)

export const selectHumanPlayers = createSelector(
  [selectPlayers],
  players => players.filter(p => p.id)
)

export const selectOnTable = createSelector(
  [selectPlayers],
  players => players.map(p => ({value: p.onTable, position: p.position}))
)