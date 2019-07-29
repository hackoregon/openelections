// campaigns.js
import { normalize } from "normalizr";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import { addEntities, ADD_ENTITIES } from "./common";
import { createSelector } from "reselect";
import { get } from "lodash";

export const STATE_KEY = "contributions";

// Action Types
export const actionTypes = {
  CREATE_CONTRIBUTION: createActionTypes(STATE_KEY, "CREATE_CONTRIBUTION"),
  UPDATE_CONTRIBUTION: createActionTypes(STATE_KEY, "UPDATE_CONTRIBUTION"),
  GET_CONTRIBUTIONS: createActionTypes(STATE_KEY, "GET_CONTRIBUTIONS"),
  GET_CONTRIBUTION_BY_ID: createActionTypes(STATE_KEY, "GET_CONTRIBUTION_BY_ID"),
  ARCHIVE_CONTRIBUTION: createActionTypes(STATE_KEY, "ARCHIVE_CONTRIBUTION"),
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
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CONTRIBUTION_BY_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.REQUEST]: (state, action) => {
    return { ...state, isLoading: true};
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.SUCCESS]: (state) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.ARCHIVE_CONTRIBUTION.FAILURE]: (state) => {
  return { ...state, isLoading: false , error: action.error };
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
  },
  getContributions: {
    request: () => action(actionTypes.GET_CONTRIBUTIONS.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTIONS.SUCCESS),
    failure: error => action(actionTypes.GET_CONTRIBUTIONS.FAILURE, { error })
  },
  getContributionById: {
    request: () => action(actionTypes.GET_CONTRIBUTION_BY_ID.REQUEST),
    success: () => action(actionTypes.GET_CONTRIBUTION_BY_ID.SUCCESS),
    failure: error =>
      action(actionTypes.GET_CONTRIBUTION_BY_ID.FAILURE, { error })
  },
  archiveContribution: {
    request: () => action(actionTypes.ARCHIVE_CONTRIBUTION.REQUEST),
    success: () => action(actionTypes.ARCHIVE_CONTRIBUTION.SUCCESS),
    failure: error =>
      action(actionTypes.ARCHIVE_CONTRIBUTION.FAILURE, { error })
  }
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
      if (response.status === 204) {
        dispatch(actionCreators.updateContribution.success());
      } else {
        dispatch(actionCreators.updateContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.updateContribution.failure(error));
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
      if (response.status === 200) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addEntities(data.entities));
        dispatch(actionCreators.getContributionById.success());
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

// Selectors

// export const getContributionsList;
export const rootState = state => state || {};

export const getContributionsList = createSelector(
  rootState,
  state =>
    Object.values(state.contributions)
      .filter(withId => !!get(withId, "id"))
      // .map(perm => {
      //   const userAndRole = { ...state.users[perm.user] };
      //   userAndRole.role = startCase(perm.role);
      //   userAndRole.roleId = perm.id;
      //   return userAndRole;
      // })
);
