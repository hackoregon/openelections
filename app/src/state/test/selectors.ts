import { createSelector } from 'reselect';


export const rootState = (state: { test: any; }) => state.test || state;
export const getCurrentState: any = createSelector(
  rootState,
  (state) => state
);