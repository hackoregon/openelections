/* eslint-disable no-unused-vars */
// campaigns.js
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
  addExpenditureEntities,
  ADD_EXPENDITURE_ENTITIES,
  resetState,
  RESET_STATE,
} from './common';
import { downloadFile } from '../utils/helpers';
import { getActivitiesByIdType } from './activities';

export const STATE_KEY = 'expenditures';

// Action Types
export const actionTypes = {
  CREATE_EXPENDITURE: createActionTypes(STATE_KEY, 'CREATE_EXPENDITURE'),
  UPDATE_EXPENDITURE: createActionTypes(STATE_KEY, 'UPDATE_EXPENDITURE'),
  GET_EXPENDITURES: createActionTypes(STATE_KEY, 'GET_EXPENDITURES'),
  GET_EXPENDITURE_BY_ID: createActionTypes(STATE_KEY, 'GET_EXPENDITURE_BY_ID'),
  POST_EXPENDITURE_COMMENT: createActionTypes(
    STATE_KEY,
    'POST_EXPENDITURE_COMMENT'
  ),
  FILTER: createCustomActionTypes(STATE_KEY, 'FILTER', ['UPDATE']),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  list: null,
  listFilterOptions: {
    from: '',
    to: '',
    status: 'all',
    page: 0,
    perPage: 50,
    sort: {},
  },
  listOrder: [],
  currentId: null,
  total: 0,
};

export const resetExpenditureState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_EXPENDITURE_ENTITIES]: (state, action) => {
    return {
      ...state,
      list: { ...action.payload.entities.expenditures },
      listOrder: action.payload.result,
    };
  },
  [actionTypes.CREATE_EXPENDITURE.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.CREATE_EXPENDITURE.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.CREATE_EXPENDITURE.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.UPDATE_EXPENDITURE.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.UPDATE_EXPENDITURE.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.UPDATE_EXPENDITURE.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_EXPENDITURES.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_EXPENDITURES.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, total: action.total };
  },
  [actionTypes.GET_EXPENDITURES.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_EXPENDITURE_BY_ID.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_EXPENDITURE_BY_ID.SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      currentId: action.id,
    };
  },
  [actionTypes.GET_EXPENDITURE_BY_ID.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.POST_EXPENDITURE_COMMENT.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.POST_EXPENDITURE_COMMENT.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.POST_EXPENDITURE_COMMENT.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.FILTER.UPDATE]: (state, action) => {
    return { ...state, listFilterOptions: action.listFilterOptions };
  },
});

// Action Creators
export const actionCreators = {
  createExpenditure: {
    request: () => action(actionTypes.CREATE_EXPENDITURE.REQUEST),
    success: () => action(actionTypes.CREATE_EXPENDITURE.SUCCESS),
    failure: error => action(actionTypes.CREATE_EXPENDITURE.FAILURE, { error }),
  },
  updateExpenditure: {
    request: () => action(actionTypes.UPDATE_EXPENDITURE.REQUEST),
    success: () => action(actionTypes.UPDATE_EXPENDITURE.SUCCESS),
    failure: error => action(actionTypes.UPDATE_EXPENDITURE.FAILURE, { error }),
  },
  getExpenditures: {
    request: () => action(actionTypes.GET_EXPENDITURES.REQUEST),
    success: total => action(actionTypes.GET_EXPENDITURES.SUCCESS, { total }),
    failure: error => action(actionTypes.GET_EXPENDITURES.FAILURE, { error }),
  },
  getExpenditureById: {
    request: () => action(actionTypes.GET_EXPENDITURE_BY_ID.REQUEST),
    success: id => action(actionTypes.GET_EXPENDITURE_BY_ID.SUCCESS, { id }),
    failure: error =>
      action(actionTypes.GET_EXPENDITURE_BY_ID.FAILURE, { error }),
  },
  postExpenditureComment: {
    request: () => action(actionTypes.POST_EXPENDITURE_COMMENT.REQUEST),
    success: () => action(actionTypes.POST_EXPENDITURE_COMMENT.SUCCESS),
    failure: error =>
      action(actionTypes.POST_EXPENDITURE_COMMENT.FAILURE, { error }),
  },
  filter: {
    update: listFilterOptions => {
      return action(actionTypes.FILTER.UPDATE, { listFilterOptions });
    },
  },
};

export function updateFilter(newFilterOptions) {
  return (dispatch, getState) => {
    // eslint-disable-next-line prefer-const
    let filterOptions = getState().expenditures.listFilterOptions;
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
  const filter = state.expenditures.listFilterOptions;
  const sort = state.expenditures.listFilterOptions.sort || {};
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

// Side Effects, e.g. thunks
export function createExpenditure(expenditureAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createExpenditure.request());
    try {
      const response = await api.createExpenditure(expenditureAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.expenditure);
        dispatch(addExpenditureEntities(data));
        dispatch(actionCreators.createExpenditure.success());
        dispatch(
          flashMessage(`Expenditure Added`, {
            props: { variant: 'success' },
          })
        );
        return data.result;
      }
      dispatch(actionCreators.createExpenditure.failure());
      dispatch(
        flashMessage(`Error - ${response.status} status returned`, {
          props: { variant: 'error' },
        })
      );
    } catch (error) {
      dispatch(actionCreators.createExpenditure.failure(error));
      dispatch(
        flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
      );
    }
  };
}

export function updateExpenditure(expenditureAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.updateExpenditure.request());
    try {
      const response = await api.updateExpenditure(expenditureAttrs);
      if (response.status === 204) {
        let status = '';
        if (expenditureAttrs.status) {
          status = expenditureAttrs.status;
        }
        dispatch(actionCreators.updateExpenditure.success());
        dispatch(
          flashMessage(`Expenditure Updated ${status}`, {
            props: { variant: 'success' },
          })
        );
        dispatch(push('/expenses'));
      } else {
        dispatch(actionCreators.updateExpenditure.failure());
        const error = await response.json();
        dispatch(
          flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
        );
        return error;
      }
    } catch (error) {
      dispatch(actionCreators.updateExpenditure.failure(error));
      dispatch(
        flashMessage(`Error - ${error}`, { props: { variant: 'error' } })
      );
      return error;
    }
  };
}

export function getExpenditures(expenditureSearchAttrs, applyFilter = false) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExpenditures.request());
    try {
      const filter = applyFilter ? getFilterOptionsForRequest(getState()) : {};
      const response = await api.getExpenditures({
        ...expenditureSearchAttrs,
        ...filter,
      });
      if (expenditureSearchAttrs.format === 'csv' && response.status === 200) {
        const expenditures = await response.text();
        downloadFile(expenditures, `expenditures-download-${Date.now()}.csv`);
      } else if (
        expenditureSearchAttrs.format === 'xml' &&
        response.status === 200
      ) {
        const expenditures = await response.json();
        expenditures.map((expenditure, index) => {
          return downloadFile(
            expenditure,
            `expenditures-download-${index + 1}-${Date.now()}.xml`
          );
        });
      } else if (response.status === 200) {
        const expenses = await response.json();
        const data = normalize(expenses.data, [schema.expenditure]);
        dispatch(addExpenditureEntities(data));
        dispatch(actionCreators.getExpenditures.success(expenses.total));
      } else {
        dispatch(actionCreators.getExpenditures.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getExpenditures.failure(error));
    }
  };
}

export function getExpenditureById(id) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExpenditureById.request());
    try {
      const response = await api.getExpenditureById(id);
      if (response.status === 200) {
        const data = normalize(await response.json(), schema.expenditure);
        dispatch(addExpenditureEntities(data));
        dispatch(actionCreators.getExpenditureById.success(id));
      } else {
        dispatch(actionCreators.getExpenditureById.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getExpenditureById.failure(error));
    }
  };
}

export function postExpenditureComment(id, comment, attachment) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.postExpenditureComment.request());
    try {
      const response = await api.postExpenditureComment(
        id,
        comment,
        attachment
      );
      if (response.status === 204) {
        dispatch(actionCreators.postExpenditureComment.success());
        dispatch(getActivitiesByIdType({ expenditureId: id }));
      } else {
        dispatch(actionCreators.postExpenditureComment.failure());
      }
    } catch (error) {
      dispatch(actionCreators.postExpenditureComment.failure(error));
    }
  };
}

// Selectors
export const rootState = state => state || {};

export const getExpendituresList = createSelector(rootState, state => {
  if (
    isEmpty(state.expenditures.list) ||
    isEmpty(state.expenditures.listOrder)
  ) {
    return [];
  }
  return state.expenditures.listOrder.map(id => state.expenditures.list[id]);
});

export const getExpendituresTotal = createSelector(rootState, state => {
  return state.expenditures.total;
});

export const getCurrentExpenditureId = state => {
  return state.expenditures &&
    state.expenditures.list &&
    state.expenditures.currentId
    ? state.expenditures.currentId
    : false;
};

export const getCurrentExpenditure = state => {
  return getCurrentExpenditureId(state)
    ? state.expenditures.list[getCurrentExpenditureId(state)]
    : false;
};

export const getExpenditureCampaignName = state => {
  const expenditure = getCurrentExpenditure(state);
  return expenditure ? expenditure.campaign.name : null;
};

export const getFilterOptions = state => {
  const filter = state.expenditures.listFilterOptions;
  const sort = state.expenditures.listFilterOptions.sort || {};
  return { ...filter, sort };
};
