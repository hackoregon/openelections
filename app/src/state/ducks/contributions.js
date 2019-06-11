// campaigns.js
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";

export const STATE_KEY = "contributions";

// Action Types
export const actionTypes = {
  CREATE_CONTRIBUTION: createActionTypes(STATE_KEY, "CREATE_CONTRIBUTION"),
  UPDATE_CONTRIBUTION: createActionTypes(STATE_KEY, "UPDATE_CONTRIBUTION"),
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
  [actionTypes.CREATE_CONTRIBUTION.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.CREATE_CONTRIBUTION.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.CREATE_CONTRIBUTION.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.UPDATE_CONTRIBUTION.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.UPDATE_CONTRIBUTION.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.UPDATE_CONTRIBUTION.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  createContribution: {
    request: () => action(actionTypes.CREATE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.CREATE_CONTRIBUTION.SUCCESS),
    failure: error => action(actionTypes.CREATE_CONTRIBUTION.FAILURE, { error })
  },
  updateContribution: {
    request: () => action(actionTypes.UPDATE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.UPDATE_CONTRIBUTION.SUCCESS),
    failure: error => action(actionTypes.UPDATE_CONTRIBUTION.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function createContribution(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createContribution.request());
    try {
      const response = await api.createContribution(contributionAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.campaign);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.createContribution.success());
      } else {
        dispatch(actionCreators.createContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.createContribution.failure(error));
    }
  };
}

export function updateContribution(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.updateContribution.request());
    try {
      const response = await api.updateContribution(contributionAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.campaign);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.updateContribution.success());
      } else {
        dispatch(actionCreators.updateContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.updateContribution.failure(error));
    }
  };
}
