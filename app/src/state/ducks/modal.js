// modal.js
import { createSelector } from "reselect";
import createReducer from "../utils/createReducer";
import createAction from "../utils/createAction";
import action from "../utils/action";
export const STATE_KEY = "modal";

// Action Types
export const actionTypes = {
  SHOW_MODAL: createAction(STATE_KEY, "SHOW_MODAL"),
  DISMISS_MODAL: createAction(STATE_KEY, "DISMISS_MODAL")
};

// Initial State
export const initialState = {
  currentModal: null,
  isActive: false,
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [actionTypes.SHOW_MODAL]: (state, action) => {
    return { ...state, isActive: true, currentModal: action.payload.component, _props: action.payload.props };
  },
  [actionTypes.DISMISS_MODAL]: (state, action) => {
    return { ...state, isActive: false, currentModal: null };
  }
});

// Action Creators
export const actionCreators = {
  showmodal: payload => {
    return action(actionTypes.SHOW_MODAL, { payload });
  },
  dismissmodal: () => action(actionTypes.DISMISS_MODAL)
};

export function showModal(payload) {
  return (dispatch, getState) => {
    dispatch(actionCreators.showmodal(payload));
  };
}

export function clearModal() {
  return (dispatch, getState) => {
    dispatch(actionCreators.dismissmodal());
  };
}

// Selectors
export const rootState = state => state || {};
export const getModalState = createSelector(
  rootState,
  state => state.modal
);

export const modalIsActive = createSelector(
  rootState,
  state => state.modal.isActive
);
