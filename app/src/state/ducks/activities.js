// activities.js
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";
import { expenditure } from "../../api/schema";

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
  ),
  GET_CONTRIBUTION_ACTIVITIES: createActionTypes(
    STATE_KEY,
    "GET_CONTRIBUTION_ACTIVITIES"
  ),
  GET_EXPENDITURE_ACTIVITIES: createActionTypes(
    STATE_KEY,
    "GET_EXPENDITURE_ACTIVITIES"
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
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.FAILURE]: (state, action) => {
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
  },
  getContributionActivities: {
    request: () => action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.FAILURE, { error })
  },
  getExpenditureActivities: {
    request: () => action(actionTypes.GET_EXPENDITURE_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_EXPENDITURE_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_EXPENDITURE_ACTIVITIES.FAILURE, { error })
  },
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

export function getContributionActivities(contributionId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributionActivities.request());
    try {
      const response = await api.getContributionActivities(contributionId);
      const data = normalize(response, [schema.activity]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getContributionActivities.success());
    } catch (error) {
      dispatch(actionCreators.getContributionActivities.failure(error));
    }
  };
}

export function getExpenditureActivities(expenditureId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExpenditureActivities.request());
    try {
      const response = await api.getExpenditureActivities(expenditureId);
      const data = normalize(response, [schema.activity]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getExpenditureActivities.success());
    } catch (error) {
      dispatch(actionCreators.getExpenditureActivities.failure(error));
    }
  };
}
