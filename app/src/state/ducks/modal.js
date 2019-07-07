// modal.js
import { createSelector } from "reselect";
import createReducer from "../utils/createReducer";
import createActionTypes from "../utils/createActionTypes";
import action from "../utils/action";
export const STATE_KEY = "modal";

// Action Types
export const actionTypes = {
  SHOW_MODAL: createActionTypes(STATE_KEY, "SHOW_MODAL"),
  DISMISS_MODAL: createActionTypes(STATE_KEY, "DISMISS_MODAL")
};

// Initial State
export const initialState = {
  currentModal: null,
  isActive: false,
  isLoading: true,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [actionTypes.SHOW_MODAL]: (state, action) => {
    return { ...state, isActive: true, currentModal: action.payload };
  },
  [actionTypes.DISMISS_MODAL]: (state, action) => {
    return { ...state, isActive: false, currentModal: null };
  }
});

// Action Creators
export const actionCreators = {
  showmodal: payload => action(actionTypes.SHOW_MODAL, { payload }),
  dismissmodal: payload => action(actionTypes.DISMISS_MODAL, { payload })
};

// Selectors
export const rootState = state => state || {};
export const getModalState = createSelector(
  rootState,
  state => state.modal
);
