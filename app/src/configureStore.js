import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createReducer } from "./state";
import auth, { STATE_KEY as AUTH_STATE_KEY } from "./state/ducks/auth";

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
    createReducer({
      [AUTH_STATE_KEY]: auth
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
}
