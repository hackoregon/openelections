// matches.js
import { cloneDeep } from 'lodash';
import createReducer from '../utils/createReducer';
import { RESET_STATE } from './common';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { getContributionById } from './contributions';

export const STATE_KEY = 'matches';

// Action Types
export const actionTypes = {
  GET_MATCHES_BY_CONTRIBUTION_ID: createActionTypes(
    STATE_KEY,
    'GET_MATCHES_BY_CONTRIBUTION_ID'
  ),
  UPDATE_MATCH_ID: createActionTypes(STATE_KEY, 'UPDATE_MATCH_ID'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  list: {},
};

// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.SUCCESS]: (state, action) => {
    const newState = cloneDeep(state);
    const match = action.match;
    newState.list[match.id] = match;
    return { ...state, isLoading: false, list: newState.list };
  },
  [actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.UPDATE_MATCH_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.UPDATE_MATCH_ID.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.UPDATE_MATCH_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators

export const actionCreators = {
  getMatchesByContributionId: {
    request: () => action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.REQUEST),
    success: match =>
      action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.SUCCESS, { match }),
    failure: error =>
      action(actionTypes.GET_MATCHES_BY_CONTRIBUTION_ID.FAILURE, { error }),
  },
  updateMatchForContribution: {
    request: () => action(actionTypes.UPDATE_MATCH_ID.REQUEST),
    success: match => action(actionTypes.UPDATE_MATCH_ID.SUCCESS, { match }),
    failure: error => action(actionTypes.UPDATE_MATCH_ID.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getMatchesByContributionId(contributionId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getMatchesByContributionId.request());
    try {
      const response = await api.getMatchesByContributionId(contributionId);
      if (response.status === 200) {
        const match = await response.json();
        match.id = contributionId;
        dispatch(actionCreators.getMatchesByContributionId.success(match));
      } else {
        dispatch(actionCreators.getMatchesByContributionId.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getMatchesByContributionId.failure(error));
    }
  };
}
/*
@attrs {
contributionId: number,
matchId: string,
matchStrength: enum[exact, strong, weak, none]
 }
 */
export function updateMatchForContribution(attrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.updateMatchForContribution.request());
    try {
      const response = await api.updateMatchForContribution(attrs);
      if (response.status === 204) {
        dispatch(getMatchesByContributionId(attrs.contributionId));
        dispatch(getContributionById(attrs.contributionId));
      } else {
        dispatch(actionCreators.updateMatchForContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.updateMatchForContribution.failure(error));
    }
  };
}
