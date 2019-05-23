import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createReducer } from "./state";

export default function configureStore(history) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  if (!composeEnhancers) {
    console.warn(
      "Install Redux DevTools Extension to inspect the app state: " +
        "https://github.com/zalmoxisus/redux-devtools-extension#installation"
    );
  }
  return createStore(
    createReducer(undefined),
    composeEnhancers(applyMiddleware(thunk))
  );
}
