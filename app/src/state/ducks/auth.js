// auth.js
import { createSelector } from "reselect";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
import * as campaigns from './campaigns';
import * as governments from './governments';
import { push } from 'connected-react-router';
import { flashMessage } from "redux-flash";


// Export State Key
export const STATE_KEY = "auth";

// Action Types
export const actionTypes = {
  ME: createActionTypes(STATE_KEY, "ME"),
  LOGIN: createActionTypes(STATE_KEY, "LOGIN"),
  REDEEM_INVITE: createActionTypes(STATE_KEY, "REDEEM_INVITE"),
  RESET_PASSWORD: createActionTypes(STATE_KEY, "RESET_PASSWORD"),
  SEND_PASSWORD_RESET_EMAIL: createActionTypes(
    STATE_KEY,
    "SEND_PASSWORD_RESET_EMAIL"
  ),
  UPDATE_PASSWORD: createActionTypes(STATE_KEY, "UPDATE_PASSWORD")
};

// Initial State
export const initialState = {
  me: null,
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [actionTypes.ME.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.ME.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, me: action.me };
  },
  [actionTypes.ME.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.LOGIN.REQUEST]: (state, action) => {
    return { ...state, isLoading: true, error: null};
  },
  [actionTypes.LOGIN.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, error: null, me: action.me };
  },
  [actionTypes.LOGIN.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.REDEEM_INVITE.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.REDEEM_INVITE.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.REDEEM_INVITE.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.RESET_PASSWORD.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.RESET_PASSWORD.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.RESET_PASSWORD.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.SEND_PASSWORD_RESET_EMAIL.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.SEND_PASSWORD_RESET_EMAIL.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.UPDATE_PASSWORD.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.UPDATE_PASSWORD.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, error: null };
  },
  [actionTypes.UPDATE_PASSWORD.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  me: {
    request: () => action(actionTypes.ME.REQUEST),
    success: me => action(actionTypes.ME.SUCCESS, { me }),
    failure: error => action(actionTypes.ME.FAILURE, { error })
  },
  login: {
    request: () => action(actionTypes.LOGIN.REQUEST),
    success: me => action(actionTypes.LOGIN.SUCCESS, { me }),
    failure: error => action(actionTypes.LOGIN.FAILURE, { error })
  },
  redeemInvite: {
    request: () => action(actionTypes.REDEEM_INVITE.REQUEST),
    success: () => action(actionTypes.REDEEM_INVITE.SUCCESS),
    failure: error => action(actionTypes.REDEEM_INVITE.FAILURE, { error })
  },
  resetPassword: {
    request: () => action(actionTypes.RESET_PASSWORD.REQUEST),
    success: () => action(actionTypes.RESET_PASSWORD.SUCCESS),
    failure: error => action(actionTypes.RESET_PASSWORD.FAILURE, { error })
  },
  sendPasswordResetEmail: {
    request: () => action(actionTypes.SEND_PASSWORD_RESET_EMAIL.REQUEST),
    success: () => action(actionTypes.SEND_PASSWORD_RESET_EMAIL.SUCCESS),
    failure: error =>
      action(actionTypes.SEND_PASSWORD_RESET_EMAIL.FAILURE, { error })
  },
  updatePassword: {
    request: () => action(actionTypes.UPDATE_PASSWORD.REQUEST),
    success: () => action(actionTypes.UPDATE_PASSWORD.SUCCESS),
    failure: error => action(actionTypes.UPDATE_PASSWORD.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function me() {
  return async (dispatch, getState, { api }) => {
    if (!document.cookie.includes('token') && !process.env.TOKEN) {
      // dont attempt if there is no token.
      return
    }
    dispatch(actionCreators.me.request());
    try {
      const me = await api.me();
      if (me && me.permissions) {
        const campaignPermission = me.permissions.filter( (permission) => {
          return permission.type = 'campaign'
        });
        if (campaignPermission.length) {
          dispatch(campaigns.actionCreators.setCampaign.success(me.permissions[0].campaignId))
        }

        const govPermission = me.permissions.filter( (permission) => {
          return permission.type = 'government'
        });
        if (govPermission.length) {
          dispatch(governments.actionCreators.setGovernment.success(me.permissions[0].governmentId))
        }
      }
      dispatch(actionCreators.me.success(me));
    } catch (error) {
      dispatch(actionCreators.me.failure(error));
    }
  };
}

export function login(email, password) {
  return async (dispatch, getState, { api }) => {
   // dispatch(actionCreators.login.failure(true));
    dispatch(actionCreators.login.request());
    try {
      await api.login(email, password)
      .then(response => {
        if (response.status === 204) {
          dispatch(actionCreators.login.success());
          dispatch(me());
          dispatch(flashMessage('Signin Success', {props:{variant:'success'}}));
          dispatch(push('/dashboard'));
        } else {
          dispatch(actionCreators.login.failure(true));
          dispatch(flashMessage("Signin Error", {props:{variant:'error'}}));
        }
      })
    } catch (error) {
      dispatch(actionCreators.login.failure(error));
      dispatch(flashMessage("Signin Error - " + error, {props:{variant:'error'}}));
    }
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(actionCreators.me.success(null));
    if (!window.location.hostname.includes('localhost')) {
      document.cookie = "token=; domain=.openelectionsportland.org; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    } else {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    dispatch(push('/sign-in'))
 };
}

export function redeemInvite(invitationCode, password, firstName, lastName) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.redeemInvite.request());
    try {
      const { status } = await api.redeemInvite(
        invitationCode,
        password,
        firstName,
        lastName
      );
      if (status === 204){
        dispatch(actionCreators.redeemInvite.success());
        dispatch(flashMessage("Signup Success", { props: { variant: "success" } }));
        dispatch(push("/sign-in"));
      }else{
        dispatch(actionCreators.redeemInvite.failure());
        dispatch(flashMessage("Signup Error", { props: { variant: "error" } }));
      }
    } catch (error) {
        dispatch(actionCreators.redeemInvite.failure(error));
        dispatch(flashMessage("Signup Error - " + error, { props: { variant: "error" } }));
    }
  };
}

export function resetPassword(invitationCode, password) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.resetPassword.request());
    try {
      const { status } = await api.resetPassword(invitationCode, password);
      if(status === 204){
        dispatch(actionCreators.resetPassword.success());
        return true;
      }else{
        dispatch(actionCreators.resetPassword.failure());
        return false;
      }

    } catch (error) {
      dispatch(actionCreators.resetPassword.failure(error));
      return false;
    }
  };
}

export function sendPasswordResetEmail(email) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.sendPasswordResetEmail.request());
    try {
      const { status } = await api.sendPasswordResetEmail(email);
      if(status === 204){
        dispatch(actionCreators.sendPasswordResetEmail.success());
        return true;
      }else{
        dispatch(actionCreators.sendPasswordResetEmail.failure());
        return false;
      }
    } catch (error) {
      dispatch(actionCreators.sendPasswordResetEmail.failure(error));
      return false;
    }
  };
}

export function updatePassword(password, newPassword) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.updatePassword.request());
    try {
      const { status } = await api.updatePassword(password, newPassword);
      if(status === 204) {
        dispatch(actionCreators.updatePassword.success());
        dispatch(flashMessage("Password updated", {props:{variant:'success'}}));
        dispatch(logout());
      }else{
        dispatch(actionCreators.updatePassword.failure('Update password request failed'));
        dispatch(flashMessage("Password update failed", {props:{variant:'error'}}));
      }

    } catch (error) {
      dispatch(actionCreators.updatePassword.failure(error));
      dispatch(flashMessage("Password update failed - " + error, {props:{variant:'error'}}));
    }
  };
}

export function redirectToLogin() {
  return async (dispatch, getState, { api }) => {
    dispatch(push('/sign-in'));
  }
}

// Selectors
export const rootState = state => state || {};

export const isLoggedIn = state => {
  return state.auth.me !== null ? true : false;
};

export const isAdmin = state => {
  return (
    state.auth.me !==
    null ? (
      state.auth.me.permissions[0].role === "government_admin" ||
        state.auth.me.permissions[0].role === "campaign_admin"
    ) : false
  );
}
