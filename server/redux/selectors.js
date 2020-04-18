import { createSelector } from 'reselect';
import declarationTypes from '../../shared/constants/declarationTypes';
import {last} from '../../shared/utils/array';

export const selectCurrentDeclaration = createSelector(
  [state => state.declarationsHistory],
  (declarationsHistory) => last(declarationsHistory.filter(d => d.type !== declarationTypes.PASS))
)