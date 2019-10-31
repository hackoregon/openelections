/* eslint-disable no-unused-vars */
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { RESET_STATE, resetState } from './common';

export const STATE_KEY = 'publicData';

// Action Types
export const actionTypes = {
  GET_PUBLIC_DATA: createActionTypes(STATE_KEY, 'GET_PUBLIC_DATA'),
};

// Initial State
export const initialState = {
  data: {},
  isLoading: false,
  error: null,
};

// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [actionTypes.GET_PUBLIC_DATA.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_PUBLIC_DATA.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, data: action.payload };
  },
  [actionTypes.GET_PUBLIC_DATA.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  getPublicData: {
    request: () => action(actionTypes.GET_PUBLIC_DATA.REQUEST),
    success: payload =>
      action(actionTypes.GET_PUBLIC_DATA.SUCCESS, { payload }),
    failure: error => action(actionTypes.GET_PUBLIC_DATA.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getPublicData() {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getPublicData.request());
    try {
      const response = await api.getContributionGeoData();
      dispatch(actionCreators.getPublicData.success(response));
    } catch (error) {
      dispatch(actionCreators.getPublicData.failure(error));
    }
  };
}
