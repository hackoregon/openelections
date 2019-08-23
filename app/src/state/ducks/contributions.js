// campaigns.js
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { get, isEmpty } from 'lodash';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { addEntities, ADD_ENTITIES } from './common';
import { getContributionActivities } from './activities';

export const STATE_KEY = 'contributions';

// Action Types
export const actionTypes = {
  CREATE_CONTRIBUTION: createActionTypes(STATE_KEY, 'CREATE_CONTRIBUTION'),
  UPDATE_CONTRIBUTION: createActionTypes(STATE_KEY, 'UPDATE_CONTRIBUTION'),
  GET_CONTRIBUTIONS: createActionTypes(STATE_KEY, 'GET_CONTRIBUTIONS'),
  GET_CONTRIBUTION_BY_ID: createActionTypes(
    STATE_KEY,
    'GET_CONTRIBUTION_BY_ID'
  ),
  ARCHIVE_CONTRIBUTION: createActionTypes(STATE_KEY, 'ARCHIVE_CONTRIBUTION'),
  POST_CONTRIBUTION_COMMENT: createActionTypes(
    STATE_KEY,
    'POST_CONTRIBUTION_COMMENT'
  ),
};

// Initial State
export const initialState = {
  list: {},
  isLoading: false,
  isLoadingB: false,
  error: null,
  currentId: 0,
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, list: action.payload.contributions || {} };
  },
  // [ADD_ENTITIES_LIST]: (state, action) => {
  //   return { ...state, ...action.payload.contributions };
  // },
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
  },
  [actionTypes.GET_CONTRIBUTIONS.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CONTRIBUTIONS.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CONTRIBUTIONS.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_CONTRIBUTION_BY_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CONTRIBUTION_BY_ID.SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      currentId: action.id,
    };
  },
  [actionTypes.GET_CONTRIBUTION_BY_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.FAILURE]: state => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.POST_CONTRIBUTION_COMMENT.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.POST_CONTRIBUTION_COMMENT.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.POST_CONTRIBUTION_COMMENT.FAILURE]: state => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  createContribution: {
    request: () => action(actionTypes.CREATE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.CREATE_CONTRIBUTION.SUCCESS),
    failure: error =>
      action(actionTypes.CREATE_CONTRIBUTION.FAILURE, { error }),
  },
  updateContribution: {
    request: () => action(actionTypes.UPDATE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.UPDATE_CONTRIBUTION.SUCCESS),
    failure: error =>
      action(actionTypes.UPDATE_CONTRIBUTION.FAILURE, { error }),
  },
  getContributions: {
    request: () => action(actionTypes.GET_CONTRIBUTIONS.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTIONS.SUCCESS),
    failure: error => action(actionTypes.GET_CONTRIBUTIONS.FAILURE, { error }),
  },
  getContributionById: {
    request: () => action(actionTypes.GET_CONTRIBUTION_BY_ID.REQUEST),
    success: id => action(actionTypes.GET_CONTRIBUTION_BY_ID.SUCCESS, { id }),
    failure: error =>
      action(actionTypes.GET_CONTRIBUTION_BY_ID.FAILURE, { error }),
  },
  archiveContribution: {
    request: () => action(actionTypes.ARCHIVE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.ARCHIVE_CONTRIBUTION.SUCCESS),
    failure: error =>
      action(actionTypes.ARCHIVE_CONTRIBUTION.FAILURE, { error }),
  },
  postContributionComment: {
    request: () => action(actionTypes.POST_CONTRIBUTION_COMMENT.REQUEST),
    success: () => action(actionTypes.POST_CONTRIBUTION_COMMENT.SUCCESS),
    failure: error =>
      action(actionTypes.POST_CONTRIBUTION_COMMENT.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function createContribution(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createContribution.request());
    try {
      const response = await api.createContribution(contributionAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.createContribution.success());
        return data.result;
      }
      dispatch(actionCreators.createContribution.failure());
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
      if (response.status === 204) {
        dispatch(actionCreators.updateContribution.success());
      } else {
        dispatch(actionCreators.updateContribution.failure());
        const error = await response.json();
        return error;
      }
    } catch (error) {
      dispatch(actionCreators.updateContribution.failure(error));
      return error;
    }
  };
}

export function getContributions(contributionSearchAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributions.request());
    try {
      const response = await api.getContributions(contributionSearchAttrs);

      if (response.status === 200) {
        const data = normalize(await response.json(), [schema.contribution]);

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

export function getContributionById(id) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributionById.request());
    try {
      const response = await api.getContributionById(id);
      console.log('HERE A', response.status);
      if (response.status === 200) {
        console.log('HERE B', response);

        const data = normalize(await response.json(), schema.contribution);
        console.log('HERE cC', data);
        dispatch(addEntities(data.entities));
        // console.log('HERE dD', data);
        dispatch(actionCreators.getContributionById.success(id));
        console.log('HERE ehhh');
      } else {
        dispatch(actionCreators.getContributionById.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getContributionById.failure(error));
    }
  };
}

export function archiveContribution(id) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.archiveContribution.request());
    try {
      const response = await api.archiveContribution(id);
      if (response.status === 200) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.archiveContribution.success());
      } else {
        dispatch(actionCreators.archiveContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.archiveContribution.failure(error));
    }
  };
}

export function postContributionComment(id, comment) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.postContributionComment.request());
    try {
      const response = await api.postContributionComment(id, comment);
      if (response.status === 204) {
        await dispatch(getContributionActivities(id));
        dispatch(actionCreators.postContributionComment.success());
      } else {
        dispatch(actionCreators.postContributionComment.failure());
      }
    } catch (error) {
      dispatch(actionCreators.postContributionComment.failure(error));
    }
  };
}

// Selectors
export const rootState = state => state || {};

export const getContributionsList = createSelector(
  rootState,
  state => Object.values(state.contributions.list)
);

export const isLoggedIn = state => {
  return state.auth.me !== null;
};
export const getCurrentContribution = state => {
  return state || false;
  // state.contributions.list[state.contributions.currentId]
};
