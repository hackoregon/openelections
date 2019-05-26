// auth.js
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";

// Services
import * as api from "../../api";

export const STATE_KEY = "users";

// Action Types
export const actionTypes = {
  INVITE_USER: createActionTypes(STATE_KEY, "INVITE_USER")
};

// Initial State
export const initialState = {
  users: null,
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [actionTypes.INVITE_USER.REQUEST]: (state, action) => {
    return { ...state, isLoading: true };
  },
  [actionTypes.INVITE_USER.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.INVITE_USER.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }
});

// Action Creators
export const actionCreators = {
  inviteUser: {
    request: () => action(actionTypes.INVITE_USER.REQUEST),
    success: () => action(actionTypes.INVITE_USER.SUCCESS),
    failure: error => action(actionTypes.INVITE_USER.FAILURE, { error })
  }
};

// Side Effects, e.g. thunks
export function inviteUser(
  email,
  firstName,
  lastName,
  campaignOrGovernmentId,
  role = null
) {
  return async dispatch => {
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
      status === 201
        ? dispatch(actionCreators.inviteUser.success())
        : dispatch(actionCreators.inviteUser.failure());
    } catch (error) {
      dispatch(actionCreators.inviteUser.failure(error));
    }
  };
}
