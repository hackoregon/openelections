import { combineReducers } from 'redux';

// Reducers
import { default as testReducer } from './test';

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export default function createReducer(asyncReducers: any) {
  return combineReducers({
    test: testReducer,
    ...asyncReducers
  });
}