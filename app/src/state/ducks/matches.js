import { cloneDeep } from 'lodash';
import { flashMessage } from 'redux-flash';
import createReducer from '../utils/createReducer';
import { RESET_STATE } from './common';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { getContributionById, getCurrentContribution } from './contributions';

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
      if (response.status === 204 || response.status === 200) {
        dispatch(getMatchesByContributionId(attrs.contributionId));
        dispatch(getContributionById(attrs.contributionId));
        dispatch(
          flashMessage(`Match Updated`, {
            props: { variant: 'success' },
          })
        );
      } else {
        dispatch(actionCreators.updateMatchForContribution.failure());
        dispatch(
          flashMessage(`Error - ${response.status} status returned`, {
            props: { variant: 'error' },
          })
        );
      }
    } catch (error) {
      dispatch(actionCreators.updateMatchForContribution.failure(error));
      flashMessage(`Error - ${error}`, { props: { variant: 'error' } });
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
  const currentContribution = getCurrentContribution(state);
  let match = {};
  let selectedMatchId = '';
  if (results) {
    selectedMatchId = currentContribution ? currentContribution.matchId : '';
    const matchId = currentMatches.matchId;
    // Create a easy to traverse structure
    for (const matchStrength of matchStrengthEnum) {
      if (
        results[matchStrength] &&
        Array.isArray(results[matchStrength]) &&
        results[matchStrength].length > 0
      ) {
        // Pass back camelcase to be pretty happy
        for (const result of results[matchStrength]) {
          match = {
            id: result.id,
            bestMatch: !!(matchId === result.id),
            matchStrength,
            selected: !!(selectedMatchId === result.id),
            firstName: result.first_name,
            lastName: result.last_name,
            address1: result.address_1,
            address2: result.address_2,
            city: result.city,
            state: result.state,
            zip: result.zip,
          };
          // Ensure the selected or best matched result is first
          if (match.selected || (match.bestMatch && !selectedMatchId)) {
            matches.unshift(match);
          } else {
            matches.push(match);
          }
        }
      }
    }
  }
  if (currentMatches.matchStrength !== 'exact') {
    if (currentContribution.matchStrength === 'none') {
      matches.unshift({
        id: results.none,
        selected: true,
        matchStrength: 'none',
      });
    } else {
      matches.push({
        id: results.none,
        selected: false,
        matchStrength: 'none',
      });
    }
  }
  return matches;
};
