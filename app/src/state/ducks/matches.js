// matches.js
import { normalize } from 'normalizr';
import createReducer from '../utils/createReducer';
import { ADD_ENTITIES, resetState, RESET_STATE, addEntities } from './common';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';

export const STATE_KEY = 'matches';

// Action Types
export const actionTypes = {
  GET_MATCHES_BY_CONTRIBUTION_ID: createActionTypes(
    STATE_KEY,
    'GET_MATCHES_BY_CONTRIBUTION_ID'
  ),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  list: null,
};

export const resetGovernmentState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, list: action.payload.matches };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators

export const actionCreators = {
  getMatchesByContributionId: {
    request: () => action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.REQUEST),
    success: () => action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.SUCCESS),
    failure: error =>
      action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getMatchesByContributionId(contributionId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getMatchesByContributionId.request());
    try {
      const response = await api.getMatchesByContributionId(contributionId);
      if (response.status === 200) {
        const matches = await response.json();
        const data = normalize(matches.data, [schema.matches]);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.getMatchesByContributionId.success());
      } else {
        dispatch(actionCreators.getMatchesByContributionId.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getMatchesByContributionId.failure(error));
    }
  };
}
