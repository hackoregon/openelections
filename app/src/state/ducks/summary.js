// activities.js
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';

export const STATE_KEY = 'summary';

// Action Types
export const actionTypes = {
  GET_SUMMARY: createActionTypes(STATE_KEY, 'GET_SUMMARY'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  contributions: [],
  expenditures: [],
};
// Reducer

export default createReducer(initialState, {
  [actionTypes.GET_SUMMARY.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_SUMMARY.SUCCESS]: (state, action) => {
    return {
      isLoading: false,
      contributions: action.contributions,
      expenditures: action.expenditures,
    };
  },
  [actionTypes.GET_SUMMARY.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  getStatusSummary: {
    request: () => action(actionTypes.GET_SUMMARY.REQUEST),
    success: (contributions, expenditures) =>
      action(actionTypes.GET_SUMMARY.SUCCESS, {
        contributions,
        expenditures,
      }),
    failure: error => action(actionTypes.GET_SUMMARY.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
// attrs of campaignId or governmentId
export function getStatusSummaryAction(attrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getStatusSummary.request());
    try {
      const response = await api.getStatusSummary(attrs);
      const body = await response.json();
      dispatch(
        actionCreators.getStatusSummary.success(
          body.contributions,
          body.expenditures
        )
      );
    } catch (error) {
      dispatch(actionCreators.getStatusSummary.failure(error));
    }
  };
}
