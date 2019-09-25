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

export const matchStrengthEnum = ['exact', 'strong', 'weak', 'none'];
export const getCurrentContributionMatch = state => {
  return state.matches && state.matches.list && state.contributions.currentId
    ? state.matches.list[state.contributions.currentId]
    : false;
};

export const getCurrentMatchResults = state => {
  const currentMatches = getCurrentContributionMatch(state);
  const matches = [];
  const results = currentMatches.results;
  if (results) {
    // Create a easy to trevers structure
    for (const matchStrength of matchStrengthEnum) {
      if (results[matchStrength] && results[matchStrength].length > 0) {
        for (const result of results[matchStrength]) {
          matches.push(result);
        }
      }
    }
  }
  return state.matches && state.matches.list && state.contributions.currentId
    ? state.matches.list[state.contributions.currentId]
    : {};
};

// matchId: '4d3cb3df-0055-4e05-b091-ddf65f48b35a',
//   matchStrength: 'exact',
//   results: {
//     exact: [
//       {
//         id: '4d3cb3df-0055-4e05-b091-ddf65f48b35a',
//         first_name: 'ASHLEY',
//         last_name: 'DAVID',
//         address_1: '19100 E BURNSIDE ST APT E232',
//         address_2: '',
//         city: 'PORTLAND',
//         state: 'OR',
//         zip: '97233',
//         address_sim: '1.0',
//         zip_sim: '1.0',
//         first_name_sim: '1.0',
//         last_name_sim: '1.0',
//       },
//     ],
//     strong: [],
//     weak: [],
//     none: '54a80b958cb6ea7b38e1bab403b84efd',
//   },
//   inPortland: false,
