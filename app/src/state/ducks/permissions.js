/* eslint-disable no-unused-vars */
import createReducer from '../utils/createReducer';
import { ADD_ENTITIES, resetState, RESET_STATE } from './common';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';

export const STATE_KEY = 'permissions';

// Action Types
export const actionTypes = {
  REMOVE_PERMISSION: createActionTypes(STATE_KEY, 'REMOVE_PERMISSION'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
};

export const resetPermissionState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.permissions };
  },
  [actionTypes.REMOVE_PERMISSION.SUCCESS]: (state, action) => {
    const newState = { ...state, isLoading: false };
    delete newState[action.permissionId];
    return newState;
  },
});

// Action Creators

export const actionCreators = {
  removePermission: {
    success: permissionId =>
      action(actionTypes.REMOVE_PERMISSION.SUCCESS, { permissionId }),
  },
};

// Side Effects, e.g. thunks

export function removePermission(permissionId) {
  return actionCreators.removePermission.success(permissionId);
}
