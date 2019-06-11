// contributions.js
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";

export const STATE_KEY = "contributions";

// Action Types
export const actionTypes = {
  ADD_CONTRIBUTION: createActionTypes(STATE_KEY, "ADD_CONTRIBUTION"),
  GET_CONTRIBUTIONS: createActionTypes(STATE_KEY, "GET_CONTRIBUTIONS")
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.contributions };
  },
  [actionTypes.ADD_CONTRIBUTION.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.ADD_CONTRIBUTION.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.ADD_CONTRIBUTION.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_CONTRIBUTIONS.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CONTRIBUTIONS.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CONTRIBUTIONS.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  addContribution: {
    request: () => action(actionTypes.ADD_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.ADD_CONTRIBUTION.SUCCESS),
    failure: error => action(actionTypes.ADD_CONTRIBUTION.FAILURE, { error })
  },
  getContributions: {
    request: () => action(actionTypes.GET_CONTRIBUTIONS.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTIONS.SUCCESS),
    failure: error => action(actionTypes.GET_CONTRIBUTIONS.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function addContribution(params = {}) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.addContribution.request());
    try {
      const response = await api.addContribution(params);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.addContribution.success());
      } else {
        dispatch(actionCreators.addContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.addContribution.failure(error));
    }
  };
}

export function getContributions(params = {}) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributions.request());
    try {
      const response = await api.getContributions(params);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.getContributions.success());
      } else {
        dispatch(actionCreators.getContributions.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getContributions.failure(error));
    }
  };
}
