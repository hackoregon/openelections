// governments.js
import createReducer from "../utils/createReducer";
import { ADD_ENTITIES } from "./common";
import createActionTypes from '../utils/createActionTypes'
import action from '../utils/action'

export const STATE_KEY = "governments";

export const actionTypes = {
  SET_GOVERNMENT: createActionTypes(STATE_KEY, "SET_GOVERNMENT")
};

// Action Types

// Initial State
export const initialState = {
  isLoading: false,
  error: null,
  currentGovernmentId: null
};

// Reducer
export default createReducer(initialState, {
  [ADD_ENTITIES]: (state, action) => {
    return { ...state, ...action.payload.governments };
  },
  [actionTypes.SET_GOVERNMENT.SUCCESS]: (state, action) => {
    return { ...state, currentGovernmentId: action.governmentId };
  }
});

// Action Creators

export const actionCreators = {
  setGovernment: {
    success: governmentId => action(actionTypes.SET_GOVERNMENT.SUCCESS, { governmentId }),
  }
};

// Side Effects, e.g. thunks

// Selectors
export const rootState = state => state || {};

//TODO: Remove default gov id to 1
export const getCurrentGovernmentId = state => {
  if(state.governments && state.governments.currentGovernmentId){
    return state.governments.currentGovernmentId !== null ? state.governments.currentGovernmentId : 1;
  }else{
    return 1
  }
  
};