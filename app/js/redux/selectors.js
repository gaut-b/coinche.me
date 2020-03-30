import { createSelector } from 'reselect';
import {SOUTH} from '../../../shared/constants/positions';

const selectPlayers = state => state.players;

export const selectSouthPlayer = createSelector(
  [selectPlayers],
  (players) => players.find(player => player.position === SOUTH)
);