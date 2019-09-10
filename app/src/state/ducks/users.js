// users.js
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { get, startCase } from 'lodash';
import { flashMessage } from 'redux-flash';
import { push } from 'connected-react-router';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { addEntities, ADD_ENTITIES, resetState, RESET_STATE } from './common';
import { removePermission } from './permissions';
import { clearModal } from './modal';

export const STATE_KEY = 'users';

// Action Types
export const actionTypes = {
  INVITE_USER: createActionTypes(STATE_KEY, 'INVITE_USER'),
  RESEND_USER_INVITE: createActionTypes(STATE_KEY, 'RESEND_USER_INVITE'),
  GET_GOVERNMENT_USERS: createActionTypes(STATE_KEY, 'GET_GOVERNMENT_USERS'),
  GET_CAMPAIGN_USERS: createActionTypes(STATE_KEY, 'GET_CAMPAIGN_USERS'),
  REMOVE_USER: createActionTypes(STATE_KEY, 'REMOVE_USER'),
};

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
};

export const resetUserState = resetState;
// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.users };
  },
  [actionTypes.INVITE_USER.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.INVITE_USER.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.INVITE_USER.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.RESEND_USER_INVITE.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.RESEND_USER_INVITE.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.RESEND_USER_INVITE.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_GOVERNMENT_USERS.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_GOVERNMENT_USERS.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_GOVERNMENT_USERS.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_CAMPAIGN_USERS.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_CAMPAIGN_USERS.SUCCESS]: state => {
    return { ...state, isLoading: false };
  },
  [actionTypes.GET_CAMPAIGN_USERS.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.REMOVE_USER.REQUEST]: (state, action) => {
    return { ...state, isLoading: true, error: action.error || null };
  },
  [actionTypes.REMOVE_USER.SUCCESS]: (state, action) => {
    const newState = { ...state, isLoading: false };
    delete newState[action.userId];
    return newState;
  },
  [actionTypes.REMOVE_USER.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  inviteUser: {
    request: () => action(actionTypes.INVITE_USER.REQUEST),
    success: () => action(actionTypes.INVITE_USER.SUCCESS),
    failure: error => action(actionTypes.INVITE_USER.FAILURE, { error }),
  },
  resendUserInvite: {
    request: () => action(actionTypes.RESEND_USER_INVITE.REQUEST),
    success: () => action(actionTypes.RESEND_USER_INVITE.SUCCESS),
    failure: error => action(actionTypes.RESEND_USER_INVITE.FAILURE, { error }),
  },
  getGovernmentUsers: {
    request: () => action(actionTypes.GET_GOVERNMENT_USERS.REQUEST),
    success: () => action(actionTypes.GET_GOVERNMENT_USERS.SUCCESS),
    failure: error =>
      action(actionTypes.GET_GOVERNMENT_USERS.FAILURE, { error }),
  },
  getCampaignUsers: {
    request: () => action(actionTypes.GET_CAMPAIGN_USERS.REQUEST),
    success: () => action(actionTypes.GET_CAMPAIGN_USERS.SUCCESS),
    failure: error => action(actionTypes.GET_CAMPAIGN_USERS.FAILURE, { error }),
  },
  removeUser: {
    request: () => action(actionTypes.REMOVE_USER.REQUEST),
    success: userId => action(actionTypes.REMOVE_USER.SUCCESS, { userId }),
    failure: error => action(actionTypes.REMOVE_USER.FAILURE, { error }),
  },
};

export function getGovernmentUsers(governmentId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getGovernmentUsers.request());
    try {
      const response = await api.getGovernmentUsers(governmentId);
      const data = normalize(response, [schema.permission]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getGovernmentUsers.success());
    } catch (error) {
      dispatch(actionCreators.getGovernmentUsers.failure(error));
    }
  };
}

export function getCampaignUsers(campaignId) {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getCampaignUsers.request());
    try {
      const response = await api.getCampaignUsers(campaignId);
      const data = normalize(response, [schema.permission]);
      dispatch(addEntities(data.entities));
      dispatch(actionCreators.getCampaignUsers.success());
    } catch (error) {
      dispatch(actionCreators.getCampaignUsers.failure(error));
    }
  };
}

// Side Effects, e.g. thunks
export function inviteUser(
  email,
  firstName,
  lastName,
  campaignOrGovernmentId,
  role = null
) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.inviteUser.request());
    try {
      const { status } = role
        ? await api.inviteUsertoCampaign(
            email,
            firstName,
            lastName,
            campaignOrGovernmentId,
            role
          )
        : await api.inviteUsertoGovernment(
            email,
            firstName,
            lastName,
            campaignOrGovernmentId
          );
      if (status === 201) {
        dispatch(actionCreators.inviteUser.success());
        role
          ? dispatch(getCampaignUsers(campaignOrGovernmentId))
          : dispatch(getGovernmentUsers(campaignOrGovernmentId));
      } else {
        dispatch(actionCreators.inviteUser.failure());
      }
    } catch (error) {
      dispatch(actionCreators.inviteUser.failure(error));
    }
  };
}

export function removeUser(userId, permissionId) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.removeUser.request());
    try {
      const response = await api.removePermission(permissionId);
      if (response.status === 200) {
        dispatch(actionCreators.removeUser.success(userId));
        dispatch(removePermission(permissionId));
        dispatch(
          flashMessage('User Removed', { props: { variant: 'success' } })
        );
        dispatch(push('/manage-portal'));
        dispatch(clearModal());
      } else {
        dispatch(actionCreators.removeUser.failure());
        dispatch(
          flashMessage('Unable to remove user', { props: { variant: 'error' } })
        );
        dispatch(clearModal());
      }
    } catch (error) {
      dispatch(actionCreators.removeUser.failure(error));
      dispatch(
        flashMessage(`Unable to remove user - ${error}`, {
          props: { variant: 'error' },
        })
      );
      dispatch(clearModal());
    }
  };
}

export function resendUserInvite(userId) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.resendUserInvite.request());
    try {
      const { status } = await api.resendInvite(userId);
      status === 204
        ? dispatch(actionCreators.resendUserInvite.success())
        : dispatch(actionCreators.resendUserInvite.failure());
    } catch (error) {
      dispatch(actionCreators.resendUserInvite.failure(error));
    }
  };
}

// Selectors
export const rootState = state => state || {};

export const getUsers = createSelector(
  rootState,
  state =>
    Object.values(state.permissions)
      .filter(perm => !!get(perm, 'id'))
      .map(perm => {
        const userAndRole = { ...state.users[perm.user] };
        userAndRole.role = startCase(perm.role);
        userAndRole.roleId = perm.id;
        return userAndRole;
      })
);

export const isUsersLoading = createSelector(
  rootState,
  state => state.users.isLoading
);
