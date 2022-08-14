import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import * as api from "../api";
import * as schema from "../api/schema";

export const store = configureStore({
  reducer: {
    // router: connectRouter(history),
    // [ACTIVITIES_STATE_KEY]: activities,
    [AUTH_STATE_KEY]: auth,
    // [CAMPAIGNS_STATE_KEY]: campaigns,
    // [CONTRIBUTIONS_STATE_KEY]: contributions,
    // [MATCHES_STATE_KEY]: matches,
    // [GOVERNMENTS_STATE_KEY]: governments,
    // [PERMISSIONS_STATE_KEY]: permissions,
    // [USERS_STATE_KEY]: users,
    // [MODAL_STATE_KEY]: modal,
    // [EXPENDITURES_STATE_KEY]: expenditures,
    // [SUMMARY_STATE_KEY]: summary,
    // [PAST_CONTRIBUTIONS_STATE_KEY]: pastContributions,
    // [PUBLIC_DATA_STATE_KEY]: publicData,
    // [EXTERNAL_DATA_STATE_KEY]: externalData,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          api,
          schema,
        },
      },
      // flashMiddleware()
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
