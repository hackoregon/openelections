// permissions.js
import createReducer from "../utils/createReducer";
import { ADD_ENTITIES } from "./common";

export const STATE_KEY = "permissions";

// Action Types

// Initial State
export const initialState = {
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.permissions };
  }
});

// Action Creators

// Side Effects, e.g. thunks
