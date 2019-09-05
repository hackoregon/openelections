// campaigns.js
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { flashMessage } from 'redux-flash';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { addExpenditureEntities, ADD_EXPENDITURE_ENTITIES } from './common';

export const STATE_KEY = 'expenditures';

// Action Types
export const actionTypes = {
  CREATE_EXPENDITURE: createActionTypes(STATE_KEY, 'CREATE_EXPENDITURE'),
  UPDATE_EXPENDITURE: createActionTypes(STATE_KEY, 'UPDATE_EXPENDITURE'),
  GET_EXPENDITURES: createActionTypes(STATE_KEY, 'GET_EXPENDITURES'),
  GET_EXPENDITURE_BY_ID: createActionTypes(STATE_KEY, 'GET_EXPENDITURE_BY_ID'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  list: null,
  currentId: null,
};

// Reducer
export default createReducer(initialState, {
  [ADD_EXPENDITURE_ENTITIES]: (state, action) => {
    return { ...state, list: { ...action.payload.expenditures } };
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
    return { ...state, isLoading: false };
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
    success: () => action(actionTypes.GET_EXPENDITURES.SUCCESS),
    failure: error => action(actionTypes.GET_EXPENDITURES.FAILURE, { error }),
  },
  getExpenditureById: {
    request: () => action(actionTypes.GET_EXPENDITURE_BY_ID.REQUEST),
    success: id => action(actionTypes.GET_EXPENDITURE_BY_ID.SUCCESS, { id }),
    failure: error =>
      action(actionTypes.GET_EXPENDITURE_BY_ID.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function createExpenditure(expenditureAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.createExpenditure.request());
    try {
      const response = await api.createExpenditure(expenditureAttrs);
      if (response.status === 201) {
        const data = normalize(await response.json(), schema.expenditure);
        dispatch(addExpenditureEntities(data.entities));
        dispatch(actionCreators.createExpenditure.success());
        dispatch(
          flashMessage(`Contribution Added`, {
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
        dispatch(actionCreators.updateExpenditure.success());
      } else {
        dispatch(actionCreators.updateExpenditure.failure());
      }
    } catch (error) {
      dispatch(actionCreators.updateExpenditure.failure(error));
    }
  };
}

export function getExpenditures(expenditureSearchAttrs) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExpenditures.request());
    try {
      const response = await api.getExpenditures(expenditureSearchAttrs);
      if (response.status === 200) {
        const data = normalize(await response.json(), [schema.expenditure]);
        dispatch(addExpenditureEntities(data.entities));
        dispatch(actionCreators.getExpenditures.success());
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
        dispatch(addExpenditureEntities(data.entities));
        dispatch(actionCreators.getExpenditureById.success(id));
      } else {
        dispatch(actionCreators.getExpenditureById.failure());
      }
    } catch (error) {
      dispatch(actionCreators.getExpenditureById.failure(error));
    }
  };
}

// Selectors
export const rootState = state => state || {};

export const getExpendituresList = createSelector(
  rootState,
  state => {
    if (isEmpty(state.expenditures.list)) {
      return [];
    }
    return Object.values(state.expenditures.list);
  }
);

export const isLoggedIn = state => {
  return state.auth.me !== null;
};
export const getCurrentExpenditure = state => {
  return state.expenditures &&
    state.expenditures.list &&
    state.expenditures.currentId
    ? state.expenditures.list[state.expenditures.currentId]
    : false;
};
