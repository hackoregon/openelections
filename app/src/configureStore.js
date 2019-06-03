import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createReducer } from "./state";
import activities, {
  STATE_KEY as ACTIVITIES_STATE_KEY
} from "./state/ducks/activities";
import auth, { STATE_KEY as AUTH_STATE_KEY } from "./state/ducks/auth";
import campaigns, {
  STATE_KEY as CAMPAIGNS_STATE_KEY
} from "./state/ducks/campaigns";
import governments, {
  STATE_KEY as GOVERNMENTS_STATE_KEY
} from "./state/ducks/governments";
import permissions, {
  STATE_KEY as PERMISSIONS_STATE_KEY
} from "./state/ducks/permissions";
import users, { STATE_KEY as USERS_STATE_KEY } from "./state/ducks/users";
import * as api from "./api";
import * as schema from "./api/schema";

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
      [ACTIVITIES_STATE_KEY]: activities,
      [AUTH_STATE_KEY]: auth,
      [CAMPAIGNS_STATE_KEY]: campaigns,
      [GOVERNMENTS_STATE_KEY]: governments,
      [PERMISSIONS_STATE_KEY]: permissions,
      [USERS_STATE_KEY]: users
    }),
    composeEnhancers(applyMiddleware(thunk.withExtraArgument({ api, schema })))
  );
}
