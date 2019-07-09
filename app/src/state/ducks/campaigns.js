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
  CREATE_CAMPAIGN: createActionTypes(STATE_KEY, "CREATE_CAMPAIGN")
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null
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
  }
});

// Action Creators
export const actionCreators = {
  createCampaign: {
    request: () => action(actionTypes.CREATE_CAMPAIGN.REQUEST),
    success: () => action(actionTypes.CREATE_CAMPAIGN.SUCCESS),
    failure: error => action(actionTypes.CREATE_CAMPAIGN.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function createCampaignForGovernment(campaignAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createCampaign.request());
    try {
      const response = await api.createCampaignForGovernment(
        campaignAttrs
      );
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

// Selectors
export const rootState = state => state || {};

export const getCampaignInfo = createSelector(
  rootState,
  state => state.campaigns
);

export const getCampaignName = state => {
  return getCampaignInfo(state).name
    ? getCampaignInfo(state).name
    : "No Campaign Name";
};
