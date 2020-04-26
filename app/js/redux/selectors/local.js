import get from 'lodash.get';
import { createSelector } from 'reselect';

export const selectIsLastTrickVisible = state => get(state, 'local.isLastTrickVisible', false)