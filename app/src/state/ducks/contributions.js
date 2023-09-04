/* eslint-disable no-unused-vars */
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { flashMessage } from 'redux-flash';
import { push } from 'connected-react-router';
import createReducer from '../utils/createReducer';
import createActionTypes, {
  createCustomActionTypes,
} from '../utils/createActionTypes';
import action from '../utils/action';
import {
  addContributionEntities,
  ADD_CONTRIBUTION_ENTITIES,
  resetState,
  RESET_STATE,
  BULK_ADD_CONTRIBUTION_ENTITIES,
  bulkAddContributionEntities,
} from './common';
import { getActivitiesByIdType } from './activities';
import { downloadFile } from '../utils/helpers';
import { isGovAdmin } from './auth';
import { getMatchesByContributionId } from './matches';
import { getContributionsByMatchId } from './pastContributions';

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
  GET_MATCHES_BY_CONTRIBUTION_ID: createActionTypes(
    STATE_KEY,
    'GET_MATCHES_BY_CONTRIBUTION_ID'
  ),
  FILTER: createCustomActionTypes(STATE_KEY, 'FILTER', ['UPDATE']),
  UPLOAD_CONTRIBUTIONS_CSV: createCustomActionTypes(
    STATE_KEY,
    'UPLOAD_CONTRIBUTIONS_CSV',
    ['REQUEST', 'RESET', 'SUCCESS', 'FAILURE']
  ),
};
const bulkUploadInitialState = {
  isLoading: false,
  error: null,
  status: null, // error, uploading, success
  message: null,
  contributionErrors: null,
};
// Initial State
export const initialState = {
  list: null,
  listOrder: [],
  listFilterOptions: {
    from: '',
    to: '',
    status: 'all',
    page: 0,
    perPage: 50,
    sort: {},
  },
  isLoading: false,
  error: null,
  currentId: 0,
  total: 0,
  bulkUpload: bulkUploadInitialState,
};

export const resetContributionState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_CONTRIBUTION_ENTITIES]: (state, action) => {
    console.log({ action });
    return {
      ...state,
      list: { ...action.payload.entities.contributions },
      listOrder: action.payload.result,
    };
  },
  [BULK_ADD_CONTRIBUTION_ENTITIES]: (state, action) => {
    console.log({ action });
    return {
      ...state,
      list: { ...action.payload.entities.contributions, ...state.list },
      listOrder: [...action.payload.result, ...state.listOrder],
    };
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
    return {
      ...state,
      isLoading: false,
      total: action.total,
    };
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
  [actionTypes.POST_CONTRIBUTION_COMMENT.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.FILTER.UPDATE]: (state, action) => {
    return { ...state, listFilterOptions: action.listFilterOptions };
  },
  [actionTypes.UPLOAD_CONTRIBUTIONS_CSV.REQUEST]: state => {
    return { ...state, bulkUpload: { isLoading: true, error: null } };
  },
  [actionTypes.UPLOAD_CONTRIBUTIONS_CSV.RESET]: state => {
    return { ...state, bulkUpload: bulkUploadInitialState };
  },
  [actionTypes.UPLOAD_CONTRIBUTIONS_CSV.SUCCESS]: (state, action) => {
    return {
      ...state,
      bulkUpload: {
        isLoading: false,
        status: 'success',
        error: null, // TODO: remove this?
        message: action.message,
        contributionErrors: null,
      },
    };
  },
  [actionTypes.UPLOAD_CONTRIBUTIONS_CSV.FAILURE]: (state, action) => {
    return {
      ...state,
      bulkUpload: {
        isLoading: false,
        status: 'error',
        error: action.message,
        message: action.message,
        contributionErrors: action.contributionErrors,
      },
    };
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
    success: total => action(actionTypes.GET_CONTRIBUTIONS.SUCCESS, { total }),
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
  filter: {
    update: listFilterOptions => {
      return action(actionTypes.FILTER.UPDATE, { listFilterOptions });
    },
  },
  uploadContributionsCsv: {
    request: () => action(actionTypes.UPLOAD_CONTRIBUTIONS_CSV.REQUEST),
    reset: () => action(actionTypes.UPLOAD_CONTRIBUTIONS_CSV.RESET),
    success: info => action(actionTypes.UPLOAD_CONTRIBUTIONS_CSV.SUCCESS, info),
    failure: error =>
      action(actionTypes.UPLOAD_CONTRIBUTIONS_CSV.FAILURE, error),
  },
};

// Side Effects, e.g. thunks
export function updateFilter(newFilterOptions) {
  return (dispatch, getState) => {
    // eslint-disable-next-line prefer-const
    let filterOptions = getState().contributions.listFilterOptions;
    if (newFilterOptions.perPage) {
      filterOptions.page = Math.floor(
        (filterOptions.page * filterOptions.perPage) / newFilterOptions.perPage
      );
    }
    Object.entries(filterOptions).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(newFilterOptions, key))
        filterOptions[key] = newFilterOptions[key];
    });
    dispatch(actionCreators.filter.update(filterOptions));
  };
}

export const getFilterOptionsForRequest = state => {
  const filter = state.contributions.listFilterOptions;
  const sort = state.contributions.listFilterOptions.sort || {};
  const returnObj = {};

  Object.entries(filter).forEach(([key, value]) => {
    // Look for any filters such as status
    if (value) {
      returnObj[key] = value;
    }
  });
  if (sort.field) {
    // If the sort field is set make sure there is also a direction
    returnObj.sort = {
      field: sort.field,
      direction: sort.direction || 'DESC',
    };
  } else {
    // Remove sort if there isn't any, defauts to last modified DESC
    delete returnObj.sort;
  }

  // API defaults to all statuses but all is not a status
  if (returnObj.status === 'all') delete returnObj.status;

  // Always pass in the pagination to maintain sync with table
  returnObj.perPage = filter.perPage;
  returnObj.page = filter.page * filter.perPage;
  return returnObj;
};

export function createContribution(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createContribution.request());
    try {
      const response = await api.createContribution(contributionAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.contribution);
        dispatch(addContributionEntities(data));
        dispatch(actionCreators.createContribution.success());
        dispatch(
          flashMessage(`Contribution Added`, {
            props: { variant: 'success' },
          })
        );
        dispatch(push(`/contributions/${data.result}`));
        return data.result;
      }
      dispatch(actionCreators.createContribution.failure());
      dispatch(
        flashMessage(`Error - ${response.status} status returned`, {
          props: { variant: 'error' },
        })
      );
    } catch (error) {
      dispatch(actionCreators.createContribution.failure(error));
      dispatch(
        flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
      );
    }
  };
}

export function updateContribution(contributionAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.updateContribution.request());
    try {
      const response = await api.updateContribution(contributionAttrs);
      if (response.status === 204) {
        let status = '';
        if (contributionAttrs.status) {
          status = contributionAttrs.status;
        }
        dispatch(actionCreators.updateContribution.success());
        dispatch(
          flashMessage(`Contribution Updated ${status}`, {
            props: { variant: 'success' },
          })
        );
        dispatch(push('/contributions'));
      } else {
        dispatch(actionCreators.updateContribution.failure());
        const error = await response.json();
        dispatch(
          flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
        );
        return error;
      }
    } catch (error) {
      dispatch(actionCreators.updateContribution.failure(error));
      dispatch(
        flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
      );
      return error;
    }
  };
}

export function getContributions(contributionSearchAttrs, applyFilter = false) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributions.request());
    try {
      const filter = applyFilter ? getFilterOptionsForRequest(getState()) : {};
      const response = await api.getContributions({
        ...contributionSearchAttrs,
        ...filter,
      });
      if (contributionSearchAttrs.format === 'csv' && response.status === 200) {
        const contributions = await response.text();
        downloadFile(contributions, `contributions-download-${Date.now()}.csv`);
      } else if (
        contributionSearchAttrs.format === 'xml' &&
        response.status === 200
      ) {
        const contributions = await response.json();
        contributions.map((contribution, index) => {
          return downloadFile(
            contribution,
            `contributions-download-${index + 1}-${Date.now()}.xml`
          );
        });
      } else if (response.status === 200) {
        const contributions = await response.json();
        const data = normalize(contributions.data, [schema.contribution]);
        dispatch(addContributionEntities(data));
        dispatch(actionCreators.getContributions.success(contributions.total));
      } else {
        dispatch(actionCreators.getContributions.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getContributions.failure(error));
    }
  };
}

export function uploadContributionCsv(file) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.uploadContributionsCsv.request());
    try {
      const state = getState();
      const contributionSearchAttrs = {
        governmentId: state.governments.currentGovernmentId,
        campaignId: state.campaigns.currentCampaignId,
        currentUserId: state.auth.me.id,
        file,
      };
      const response = await api.bulkUploadContribution({
        ...contributionSearchAttrs,
      });
      if (response.status === 200) {
        // Success
        const json = await response.json();
        const data = normalize(json.contributions, [schema.contribution]);
        console.log('duck', json, data);
        dispatch(bulkAddContributionEntities(data));
        dispatch(actionCreators.uploadContributionsCsv.success(json));
      } else {
        console.log('oh snap, error');
        const json = await response.json();
        console.log('json error: ', { json });
        const errMessage = json.message || 'Could not upload CSV.';
        dispatch(
          actionCreators.uploadContributionsCsv.failure({
            message: errMessage,
            contributionErrors: json.issues,
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(actionCreators.uploadContributionsCsv.failure(error));
    }
  };
}

export function clearBulkUploadState() {
  return dispatch => {
    return dispatch(actionCreators.uploadContributionsCsv.reset());
  };
}

export function getContributionById(id) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getContributionById.request());
    try {
      const response = await api.getContributionById(id);
      if (response.status === 200) {
        const json = await response.json();
        const data = normalize(json, schema.contribution);
        dispatch(addContributionEntities(data));
        dispatch(actionCreators.getContributionById.success(id));
        if (isGovAdmin(getState())) {
          dispatch(getMatchesByContributionId(id));
          if (json.matchId) {
            dispatch(getContributionsByMatchId(json.matchId));
          }
        }
        // dispatch(getContributionActivities(id));
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
        dispatch(addContributionEntities(data));
        dispatch(actionCreators.archiveContribution.success());
      } else {
        dispatch(actionCreators.archiveContribution.failure());
      }
    } catch (error) {
      dispatch(actionCreators.archiveContribution.failure(error));
    }
  };
}

export function postContributionComment(id, comment, attachment) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.postContributionComment.request());
    try {
      const response = await api.postContributionComment(
        id,
        comment,
        attachment
      );
      if (response.status === 204) {
        dispatch(getActivitiesByIdType({ contributionId: id }));
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

export const getContributionsList = createSelector(rootState, state => {
  if (
    isEmpty(state.contributions.list) ||
    isEmpty(state.contributions.listOrder)
  ) {
    return [];
  }
  return state.contributions.listOrder.map(id => state.contributions.list[id]);
});

export const getContributionsTotal = createSelector(rootState, state => {
  return state.contributions.total;
});

export const getCurrentContribution = state => {
  return state.contributions &&
    state.contributions.list &&
    state.contributions.currentId
    ? state.contributions.list[state.contributions.currentId]
    : false;
};

export const getContributionCampaignName = state => {
  const contribution = getCurrentContribution(state);
  return contribution ? contribution.campaign.name : null;
};

export const getFilterOptions = state => {
  const filter = state.contributions.listFilterOptions;
  const sort = state.contributions.listFilterOptions.sort || {};
  return { ...filter, sort };
};

export const getBulkUploadStatus = state => {
  return state.contributions.bulkUpload;
};
