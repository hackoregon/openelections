import { createSelector } from 'reselect';


export const rootState = (state) => state.test || state;
export const getCurrentState = createSelector(
  rootState,
  (state) => state
);