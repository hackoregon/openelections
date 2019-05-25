// auth.js

// Services
import * as api from "../../api";

// Action Types
export const actionTypes = {
  LOGIN_REQUEST: "openelections/auth/LOGIN_REQUEST",
  LOGIN_SUCCESS: "openelections/auth/LOGIN_SUCCESS",
  LOGIN_FAILURE: "openelections/auth/LOGIN_FAILURE",
  REDEEM_INVITE_REQUEST: "openelections/auth/REDEEM_INVITE_REQUEST",
  REDEEM_INVITE_SUCCESS: "openelections/auth/REDEEM_INVITE_SUCCESS",
  REDEEM_INVITE_FAILURE: "openelections/auth/REDEEM_INVITE_FAILURE"
};

// Initial State
export const initialState = {
  me: null,
  isLoading: false,
  error: null
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return { ...state, isLoading: true };
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, isLoading: false, me: action.me };
    case actionTypes.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

// Action Creators
export const actionCreators = {
  setLoginRequest: () => ({ type: actionTypes.LOGIN_REQUEST }),
  setLoginSuccess: me => ({ type: actionTypes.LOGIN_SUCCESS, me }),
  setLoginFailure: error => ({ type: actionTypes.LOGIN_FAILURE, error }),
  setRedeemInviteRequest: () => ({ type: actionTypes.REDEEM_INVITE_REQUEST }),
  setRedeemInviteSuccess: me => ({
    type: actionTypes.REDEEM_INVITE_SUCCESS,
    me
  }),
  setRedeemInviteFailure: error => ({
    type: actionTypes.REDEEM_INVITE_FAILURE,
    error
  })
};

// Side Effects, e.g. thunks
export function login(email, password) {
  return async dispatch => {
    dispatch(actionCreators.setLoginRequest());
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
      dispatch(actionCreators.setLoginSuccess(me));
    } catch (error) {
      dispatch(actionCreators.setLoginFailure(error));
    }
  };
}

export function redeemInvite(invitationCode, password, firstName, lastName) {
  return async dispatch => {
    dispatch(actionCreators.setRedeemInviteRequest());
    try {
      const { status } = await api.redeemInvite(
        invitationCode,
        password,
        firstName,
        lastName
      );
      status === 204
        ? dispatch(actionCreators.setRedeemInviteSuccess())
        : dispatch(actionCreators.setRedeemInviteFailure());
    } catch (error) {
      dispatch(actionCreators.setRedeemInviteFailure(error));
    }
  };
}
