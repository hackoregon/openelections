/* eslint-disable no-unused-vars */
import { cloneDeep } from 'lodash';
import createReducer from '../utils/createReducer';
import { RESET_STATE } from './common';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';

export const STATE_KEY = 'pastContributions';

// Action Types
export const actionTypes = {
  GET_PAST_CONTRIBUTIONS_BY_MATCH_ID: createActionTypes(
    STATE_KEY,
    'GET_PAST_CONTRIBUTIONS_BY_MATCH_ID'
  ),
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
  [actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.SUCCESS]: (state, action) => {
    const newState = cloneDeep(state);
    const pastContributions = action.pastContributions;
    newState.list[action.matchId] = pastContributions;
    return { ...state, isLoading: false, list: newState.list };
  },
  [actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators

export const actionCreators = {
  getContributionsByMatchId: {
    request: () =>
      action(actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.REQUEST),
    success: (matchId, pastContributions) =>
      action(actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.SUCCESS, {
        matchId,
        pastContributions,
      }),
    failure: error =>
      action(actionTypes.GET_PAST_CONTRIBUTIONS_BY_MATCH_ID.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getContributionsByMatchId(matchId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributionsByMatchId.request());
    try {
      const response = await api.getContributions({ matchId, governmentId: 1 });

      if (response.status === 200) {
        const contributions = await response.json();
        dispatch(
          actionCreators.getContributionsByMatchId.success(
            matchId,
            contributions.data
          )
        );
      } else {
        dispatch(actionCreators.getContributionsByMatchId.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getContributionsByMatchId.failure(error));
    }
  };
}
