// auth.js
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";

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
    return { ...state, isLoading: true };
  },
  [actionTypes.LOGIN.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, me: action.me };
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
    return { ...state, isLoading: false };
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
    dispatch(actionCreators.me.request());
    try {
      const me = await api.me();
      dispatch(actionCreators.me.success(me));
    } catch (error) {
      dispatch(actionCreators.me.failure(error));
    }
  };
}

export function login(email, password) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.login.request());
    try {
      const response = await api.login(email, password);
      /**
       * Make second request to /me or just decode
       * token from login response headers?
       */
      const token = response.headers
        .get("set-cookie")
        .match(/=([a-zA-Z0-9].+); Path/)[1];
      const me = api.decodeToken(token);
      dispatch(actionCreators.login.success(me));
    } catch (error) {
      dispatch(actionCreators.login.failure(error));
    }
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
      status === 204
        ? dispatch(actionCreators.redeemInvite.success())
        : dispatch(actionCreators.redeemInvite.failure());
    } catch (error) {
      dispatch(actionCreators.redeemInvite.failure(error));
    }
  };
}

export function resetPassword(invitationCode, password) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.resetPassword.request());
    try {
      const { status } = await api.resetPassword(invitationCode, password);
      status === 204
        ? dispatch(actionCreators.resetPassword.success())
        : dispatch(actionCreators.resetPassword.failure());
    } catch (error) {
      dispatch(actionCreators.resetPassword.failure(error));
    }
  };
}

export function sendPasswordResetEmail(email) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.sendPasswordResetEmail.request());
    try {
      const { status } = await api.sendPasswordResetEmail(email);
      status === 204
        ? dispatch(actionCreators.sendPasswordResetEmail.success())
        : dispatch(actionCreators.sendPasswordResetEmail.failure());
    } catch (error) {
      dispatch(actionCreators.sendPasswordResetEmail.failure(error));
    }
  };
}

export function updatePassword(password, newPassword) {
  return async (dispatch, getState, { api }) => {
    dispatch(actionCreators.updatePassword.request());
    try {
      const { status } = await api.updatePassword(password, newPassword);
      status === 204
        ? dispatch(actionCreators.updatePassword.success())
        : dispatch(actionCreators.updatePassword.failure());
    } catch (error) {
      dispatch(actionCreators.updatePassword.failure(error));
    }
  };
}
