// activities.js
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";

export const STATE_KEY = "activities";

// Action Types
export const actionTypes = {
  GET_CAMPAIGN_ACTIVITIES: createActionTypes(
    STATE_KEY,
    "GET_CAMPAIGN_ACTIVITIES"
  ),
  GET_GOVERNMENT_ACTIVITIES: createActionTypes(
    STATE_KEY,
    "GET_GOVERNMENT_ACTIVITIES"
  )
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.activities };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  getCampaignActivities: {
    request: () => action(actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_CAMPAIGN_ACTIVITIES.FAILURE, { error })
  },
  getGovernmentActivities: {
    request: () => action(actionTypes.GET_GOVERNMENT_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_GOVERNMENT_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_GOVERNMENT_ACTIVITIES.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function getCampaignActivities(campaignId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getCampaignActivities.request());
    try {
      const response = await api.getCampaignActivities(campaignId);
      const data = normalize(response, [schema.activity]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getCampaignActivities.success());
    } catch (error) {
      dispatch(actionCreators.getCampaignActivities.failure(error));
    }
  };
}

export function getGovernmentActivities(governmentId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getGovernmentActivities.request());
    try {
      const response = await api.getGovernmentActivities(governmentId);
      const data = normalize(response, [schema.activity]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getGovernmentActivities.success());
    } catch (error) {
      dispatch(actionCreators.getGovernmentActivities.failure(error));
    }
  };
}
