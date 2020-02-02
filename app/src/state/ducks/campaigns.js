/* eslint-disable no-unused-vars */
import { createSelector } from 'reselect';
import { normalize } from 'normalizr';
import { flashMessage } from 'redux-flash';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { addEntities, ADD_ENTITIES, resetState, RESET_STATE } from './common';
import { inviteUser } from './users';
import { getCurrentCampaignId } from './auth';

export const STATE_KEY = 'campaigns';

// Action Types
export const actionTypes = {
  CREATE_CAMPAIGN: createActionTypes(STATE_KEY, 'CREATE_CAMPAIGN'),
  SET_CAMPAIGN: createActionTypes(STATE_KEY, 'SET_CAMPAIGN'),
  GET_CAMPAIGNS: createActionTypes(STATE_KEY, 'GET_CAMPAIGNS'),
  UPDATE_CAMPAIGN_NAME: createActionTypes(STATE_KEY, 'UPDATE_CAMPAIGN_NAME'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  currentCampaignId: null,
  list: {},
};

export const resetCampaignState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, list: action.payload.campaigns };
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
  },
  // [actionTypes.UPDATE_CAMPAIGN_NAME.REQUEST]: (state, action) => {
  //   return { ...state, isLoading: true };
  // },
  // [actionTypes.UPDATE_CAMPAIGN_NAME.SUCCESS]: (state, action) => {
  //   return { ...state, isLoading: false };
  // },
  // [actionTypes.UPDATE_CAMPAIGN_NAME.FAILURE]: (state, action) => {
  //   return { ...state, isLoading: false, error: action.error };
  // },
});

// Action Creators
export const actionCreators = {
  createCampaign: {
    request: () => action(actionTypes.CREATE_CAMPAIGN.REQUEST),
    success: () => action(actionTypes.CREATE_CAMPAIGN.SUCCESS),
    failure: error => action(actionTypes.CREATE_CAMPAIGN.FAILURE, { error }),
  },
  setCampaign: {
    success: campaignId =>
      action(actionTypes.SET_CAMPAIGN.SUCCESS, { campaignId }),
  },
  getCampaigns: {
    request: () => action(actionTypes.GET_CAMPAIGNS.REQUEST),
    success: () => action(actionTypes.GET_CAMPAIGNS.SUCCESS),
    failure: error => action(actionTypes.GET_CAMPAIGNS.FAILURE, { error }),
  },
  updateCampaignName: {
    request: () => action(actionTypes.UPDATE_CAMPAIGN_NAME.REQUEST),
    success: () => action(actionTypes.UPDATE_CAMPAIGN_NAME.SUCCESS),
    failure: error =>
      action(actionTypes.UPDATE_CAMPAIGN_NAME.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function createCampaignForGovernment(
  governmentId,
  campaignName,
  officeSought,
  email,
  firstName,
  lastName
) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createCampaign.request());
    const campaignAttrs = {
      governmentId,
      name: campaignName,
      officeSought,
    };
    try {
      const response = await api.createCampaignForGovernment(campaignAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.campaign);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.createCampaign.success());
        dispatch(
          inviteUser(
            email,
            firstName,
            lastName,
            data.result,
            api.UserRoleEnum.CAMPAIGN_ADMIN
          )
        );
        dispatch(
          flashMessage('Campaign created', { props: { variant: 'success' } })
        );
      } else {
        dispatch(actionCreators.createCampaign.failure());
        dispatch(
          flashMessage('Unable to create Campaign', {
            props: { variant: 'error' },
          })
        );
      }
    } catch (error) {
      dispatch(actionCreators.createCampaign.failure(error));
      dispatch(
        flashMessage(`Unable to create Campaign - ${error}`, {
          props: { variant: 'error' },
        })
      );
    }
  };
}

export function updateCampaignName(governmentId, campaignId, campaignName) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.updateCampaignName.request());
    const campaignAttrs = {
      governmentId,
      campaignId,
      newName: campaignName,
    };
    try {
      const response = await api.updateCampaignNameForGovernment(campaignAttrs);
      if (response.status === 201) {
        dispatch(actionCreators.updateCampaignName.success());
        dispatch(
          flashMessage('Campaign name updated', {
            props: {
              variant: 'success',
            },
          })
        );
      }
    } catch (error) {
      dispatch(actionCreators.updateCampaignName.failure(error));
      dispatch(
        flashMessage(`Unable to update campaign name - ${error}`, {
          props: { variant: 'error' },
        })
      );
    }
  };
}

export function getCampaigns(governmentId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getCampaigns.request());

    try {
      const response = await api.getCampaignsForGovernment(governmentId);
      if (Array.isArray(response)) {
        const data = normalize(response, [schema.campaign]);
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

// Assumes one campaign
export const getCampaignName = state => {
  const id = getCurrentCampaignId(state);

  return id &&
    state.campaigns.list &&
    state.campaigns.list[id] &&
    state.campaigns.list[id].name
    ? state.campaigns.list[id].name
    : 'Campaign';
};

export const getCampaignList = createSelector(
  rootState,
  state => {
    return state.campaigns.list ? Object.values(state.campaigns.list) : [{}];
  }
);

export const isCampaignsLoading = createSelector(
  rootState,
  state => state.campaigns.isLoading
);
