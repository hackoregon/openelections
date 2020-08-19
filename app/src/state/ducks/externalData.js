import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';
import action from '../utils/action';
import { RESET_STATE } from './common';

export const STATE_KEY = 'externalData';
// Action Types
export const actionTypes = {
  GET_EXTERNAL_DATA: createActionTypes(STATE_KEY, 'GET_EXTERNAL_DATA'),
};

// Initial State
export const initialState = {
  data: {
    type: 'FeatureCollection',
    features: [],
  },
  isLoading: false,
  error: null,
};

// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [actionTypes.GET_EXTERNAL_DATA.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_EXTERNAL_DATA.SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      data: action.payload,
      timeLoaded: new Date(),
    };
  },
  [actionTypes.GET_EXTERNAL_DATA.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  getExternalData: {
    request: () => action(actionTypes.GET_EXTERNAL_DATA.REQUEST),
    success: payload =>
      action(actionTypes.GET_EXTERNAL_DATA.SUCCESS, { payload }),
    failure: error => action(actionTypes.GET_EXTERNAL_DATA.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getExternalData() {
  return async (dispatch, _getState, { api, schema }) => {
    dispatch(actionCreators.getExternalData.request());
    try {
      const response = await api.getExternalContributionGeoData();
      dispatch(actionCreators.getExternalData.success(response));
    } catch (error) {
      dispatch(actionCreators.getExternalData.failure(error));
    }
  };
}
