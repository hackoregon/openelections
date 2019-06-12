// governments.js
import createReducer from "../utils/createReducer";
import { ADD_ENTITIES } from "./common";

export const STATE_KEY = "governments";

// Action Types

// Initial State
export const initialState = {
  isLoading: false,
  error: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.governments };
  }
});

// Action Creators

// Side Effects, e.g. thunks
