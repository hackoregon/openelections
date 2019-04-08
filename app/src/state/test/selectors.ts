import { createSelector } from 'reselect';


export const rootState = (state: { test: any; }) => state.test || state;
export const getCurrentState = createSelector(
  rootState,
  (state) => state
);