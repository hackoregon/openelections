// activities.js
import { normalize } from 'normalizr';
import { isEmpty } from 'lodash';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { RESET_STATE, resetState } from './common';

export const STATE_KEY = 'activities';
export const ADD_ACTIVITY_ENTITIES = 'ADD_ACTIVITY_ENTITIES';
export const addActivityEntities = entities => {
  return {
    type: ADD_ACTIVITY_ENTITIES,
    payload: entities,
  };
};

// Action Types
export const actionTypes = {
  GET_CAMPAIGN_ACTIVITIES: createActionTypes(
    STATE_KEY,
    'GET_CAMPAIGN_ACTIVITIES'
  ),
  GET_GOVERNMENT_ACTIVITIES: createActionTypes(
    STATE_KEY,
    'GET_GOVERNMENT_ACTIVITIES'
  ),
  GET_CONTRIBUTION_ACTIVITIES: createActionTypes(
    STATE_KEY,
    'GET_CONTRIBUTION_ACTIVITIES'
  ),
  GET_EXPENDITURE_ACTIVITIES: createActionTypes(
    STATE_KEY,
    'GET_EXPENDITURE_ACTIVITIES'
  ),
};

// Initial State
export const initialState = {
  list: null,
  listOrder: [],
  isLoading: false,
  error: null,
};

export const resetActvityState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_ACTIVITY_ENTITIES]: (state, action) => {
    return {
      ...state,
      list: { ...state.list, ...action.payload.entities.activities },
      listOrder: action.payload.result,
    };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CAMPAIGN_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_GOVERNMENT_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CONTRIBUTION_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_EXPENDITURE_ACTIVITIES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  getCampaignActivities: {
    request: () => action(actionTypes.GET_CAMPAIGN_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_CAMPAIGN_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_CAMPAIGN_ACTIVITIES.FAILURE, { error }),
  },
  getGovernmentActivities: {
    request: () => action(actionTypes.GET_GOVERNMENT_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_GOVERNMENT_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_GOVERNMENT_ACTIVITIES.FAILURE, { error }),
  },
  getContributionActivities: {
    request: () => action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_CONTRIBUTION_ACTIVITIES.FAILURE, { error }),
  },
  getExpenditureActivities: {
    request: () => action(actionTypes.GET_EXPENDITURE_ACTIVITIES.REQUEST),
    success: () => action(actionTypes.GET_EXPENDITURE_ACTIVITIES.SUCCESS),
    failure: error =>
      action(actionTypes.GET_EXPENDITURE_ACTIVITIES.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getCampaignActivities(campaignId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getCampaignActivities.request());
    try {
      const response = await api.getCampaignActivities(campaignId);
      const data = normalize(response, [schema.activity]);
      dispatch(addActivityEntities(data));
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
      dispatch(addActivityEntities(data));
      dispatch(actionCreators.getGovernmentActivities.success());
    } catch (error) {
      dispatch(actionCreators.getGovernmentActivities.failure(error));
    }
  };
}

export function getContributionActivities(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributionActivities.request());
    try {
      const response = await api.getContributionActivities(contributionAttrs);
      const data = normalize(response, [schema.activity]);
      dispatch(addActivityEntities(data));
      dispatch(actionCreators.getContributionActivities.success());
    } catch (error) {
      dispatch(actionCreators.getContributionActivities.failure(error));
    }
  };
}

export function getExpenditureActivities(activitiesAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExpenditureActivities.request());
    try {
      const response = await api.getExpenditureActivities(activitiesAttrs);
      const data = normalize(response, [schema.activity]);
      dispatch(addActivityEntities(data));
      dispatch(actionCreators.getExpenditureActivities.success());
    } catch (error) {
      dispatch(actionCreators.getExpenditureActivities.failure(error));
    }
  };
}
// {id, page, pageSize, clearFirst=true}
export function getActivitiesByIdType(activitiesAttrs, clearFirst = true) {
  const {
    expenditureId,
    contributionId,
    governmentId,
    campaignId,
  } = activitiesAttrs;
  return async (dispatch, getState, { api, schema }) => {
    if (clearFirst) {
      const data = normalize({ list: [], listOrder: [] }, [schema.activity]);
      dispatch(addActivityEntities(data));
    }
    if (expenditureId) dispatch(getExpenditureActivities(activitiesAttrs));
    if (contributionId) {
      dispatch(getContributionActivities(activitiesAttrs));
    }
    if (governmentId) dispatch(getGovernmentActivities(activitiesAttrs));
    if (campaignId) dispatch(getCampaignActivities(activitiesAttrs));
  };
}

export const getActivities = state => {
  if (isEmpty(state.activities.list) || isEmpty(state.activities.listOrder)) {
    return [];
  }
  return state.activities.listOrder.map(id => state.activities.list[id]);
};
