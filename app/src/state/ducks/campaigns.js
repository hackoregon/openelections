// campaigns.js
import { createSelector } from "reselect";
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";

export const STATE_KEY = "campaigns";

// Action Types
export const actionTypes = {
  CREATE_CAMPAIGN: createActionTypes(STATE_KEY, "CREATE_CAMPAIGN"),
  SET_CAMPAIGN: createActionTypes(STATE_KEY, "SET_CAMPAIGN"),
  GET_CAMPAIGNS: createActionTypes(STATE_KEY, "GET_CAMPAIGNS")
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  currentCampaignId: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.campaigns };
  },
  [actionTypes.CREATE_CAMPAIGN.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.CREATE_CAMPAIGN.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.CREATE_CAMPAIGN.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.SET_CAMPAIGN.SUCCESS]: (state, action) => {
    return { ...state, currentCampaignId: action.campaignId };
  },
  [actionTypes.GET_CAMPAIGNS.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CAMPAIGNS.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CAMPAIGNS.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  createCampaign: {
    request: () => action(actionTypes.CREATE_CAMPAIGN.REQUEST),
    success: () => action(actionTypes.CREATE_CAMPAIGN.SUCCESS),
    failure: error => action(actionTypes.CREATE_CAMPAIGN.FAILURE, { error })
  },
  setCampaign: {
    success: campaignId =>
      action(actionTypes.SET_CAMPAIGN.SUCCESS, { campaignId })
  },
  getCampaigns: {
    request: () => action(actionTypes.GET_CAMPAIGNS.REQUEST),
    success: () => action(actionTypes.GET_CAMPAIGNS.SUCCESS),
    failure: error => action(actionTypes.GET_CAMPAIGNS.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function createCampaignForGovernment(campaignAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createCampaign.request());
    try {
      const response = await api.createCampaignForGovernment(campaignAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.campaign);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.createCampaign.success());
      } else {
        dispatch(actionCreators.createCampaign.failure());
      }
    } catch (error) {
      dispatch(actionCreators.createCampaign.failure(error));
    }
  };
}

export function getCampaigns(governmentId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getCampaigns.request());
    try {
      const response = await api.getCampaignsForGovernment(governmentId);
      if (Array.isArray(response)) {
        const data = normalize(response, schema.campaign);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.getCampaigns.success());
      } else {
        dispatch(actionCreators.getCampaigns.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getCampaigns.failure(error));
    }
  };
}

// Selectors
export const rootState = state => state || {};

export const getCampaignInfo = createSelector(
  rootState,
  state => state.campaigns
);

//Assumes one campaign
export const getCampaignName = state => {
  const id = getCampaignInfo(state).currentCampaignId
    ? getCampaignInfo(state).currentCampaignId
    : 0;
  return getCampaignInfo(state)[id]
    ? getCampaignInfo(state)[id].name
    : "Campaign";
};
