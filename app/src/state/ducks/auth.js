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
  REDEEM_INVITE_FAILURE: "openelections/auth/REDEEM_INVITE_FAILURE",
  ME_REQUEST: "openelections/auth/ME_REQUEST",
  ME_SUCCESS: "openelections/auth/ME_SUCCESS",
  ME_FAILURE: "openelections/auth/ME_FAILURE"
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
    case actionTypes.ME_REQUEST:
      return { ...state, isLoading: true };
    case actionTypes.ME_SUCCESS:
      return { ...state, isLoading: false, me: action.me };
    case actionTypes.ME_FAILURE:
      return { ...state, isLoading: false, error: action.error };
    case actionTypes.LOGIN_REQUEST:
      return { ...state, isLoading: true };
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, isLoading: false, me: action.me };
    case actionTypes.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.error };
    case actionTypes.REDEEM_INVITE_REQUEST:
      return { ...state, isLoading: true };
    case actionTypes.REDEEM_INVITE_SUCCESS:
      return { ...state, isLoading: false };
    case actionTypes.REDEEM_INVITE_FAILURE:
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

// Action Creators
export const actionCreators = {
  setMeRequest: () => ({ type: actionTypes.ME_REQUEST }),
  setMeSuccess: me => ({ type: actionTypes.ME_SUCCESS, me }),
  setMeFailure: error => ({ type: actionTypes.ME_FAILURE, error }),
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
export function me() {
  return async dispatch => {
    dispatch(actionCreators.setMeRequest());
    try {
      const me = await api.me();
      dispatch(actionCreators.setMeSuccess(me));
    } catch (error) {
      dispatch(actionCreators.setMeFailure(error));
    }
  };
}

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
