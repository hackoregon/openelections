import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { middleware as flashMiddleware } from 'redux-flash';
import ReduxQuerySync from './utils/redux-query-sync';
import { createReducer } from './state';
import contributions, {
  STATE_KEY as CONTRIBUTIONS_STATE_KEY,
} from './state/ducks/contributions';
import activities, {
  STATE_KEY as ACTIVITIES_STATE_KEY,
} from './state/ducks/activities';
import auth, { STATE_KEY as AUTH_STATE_KEY } from './state/ducks/auth';
import campaigns, {
  STATE_KEY as CAMPAIGNS_STATE_KEY,
} from './state/ducks/campaigns';
import governments, {
  STATE_KEY as GOVERNMENTS_STATE_KEY,
} from './state/ducks/governments';
import permissions, {
  STATE_KEY as PERMISSIONS_STATE_KEY,
} from './state/ducks/permissions';
import expenditures, {
  STATE_KEY as EXPENDITURES_STATE_KEY,
} from './state/ducks/expenditures';
import matches, { STATE_KEY as MATCHES_STATE_KEY } from './state/ducks/matches';
import pastContributions, {
  STATE_KEY as PAST_CONTRIBUTIONS_STATE_KEY,
} from './state/ducks/pastContributions';
import publicData, {
  STATE_KEY as PUBLIC_DATA_STATE_KEY,
  selectedOffices,
  setSelectedOffices,
  selectedCampaigns,
  setSelectedCampaigns,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  selectedCount,
  setSelectedCount,
  publicDataRequestIsLoading,
  setSelectedFinancing,
  selectedFinancing,
  selectedCompare,
  setSelectedCompare,
} from './state/ducks/publicData';
import externalData, {
  STATE_KEY as EXTERNAL_DATA_STATE_KEY,
} from './state/ducks/externalData';
import summary, { STATE_KEY as SUMMARY_STATE_KEY } from './state/ducks/summary';
import users, { STATE_KEY as USERS_STATE_KEY } from './state/ducks/users';
import modal, { STATE_KEY as MODAL_STATE_KEY } from './state/ducks/modal';
import * as api from './api';
import * as schema from './api/schema';

const params = {
  financing: {
    selector: selectedFinancing,
    action: setSelectedFinancing,
    defaultValue: 'public',
  },
  count: {
    selector: selectedCount,
    action: setSelectedCount,
    defaultValue: false,
    stringToValue: value => value === 'true',
  },
  compare: {
    selector: selectedCompare,
    action: setSelectedCompare,
    defaultValue: false,
    stringToValue: value => value === 'true',
  },
  offices: {
    selector: selectedOffices,
    action: setSelectedOffices,
    defaultValue: [],
    multiple: true,
    defer: publicDataRequestIsLoading,
  },
  campaigns: {
    selector: selectedCampaigns,
    action: setSelectedCampaigns,
    defaultValue: [],
    multiple: true,
    valueToString: value => JSON.stringify(value),
    stringToValue: string => {
      try {
        const arr = JSON.parse(string);
        return arr;
      } catch {
        const arr = [];
        return arr;
      }
    },
    defer: publicDataRequestIsLoading,
  },
  startDate: {
    selector: selectedStartDate,
    action: setSelectedStartDate,
    defaultValue: null,
  },
  endDate: {
    selector: selectedEndDate,
    action: setSelectedEndDate,
    defaultValue: null,
  },
};
const initialTruth = 'location';
const replaceState = true;

const storeEnhancer = ReduxQuerySync.enhancer({
  params,
  initialTruth,
  replaceState,
});

export default function configureStore(history) {
  const composeEnhancers =
    process.env.NODE_ENV === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : compose;
  if (
    process.env.NODE_ENV === 'development' &&
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    console.warn(
      'Install Redux DevTools Extension to inspect the app state: ' +
        'https://github.com/zalmoxisus/redux-devtools-extension#installation'
    );
  }
  return createStore(
    createReducer({
      router: connectRouter(history),
      [ACTIVITIES_STATE_KEY]: activities,
      [AUTH_STATE_KEY]: auth,
      [CAMPAIGNS_STATE_KEY]: campaigns,
      [CONTRIBUTIONS_STATE_KEY]: contributions,
      [MATCHES_STATE_KEY]: matches,
      [GOVERNMENTS_STATE_KEY]: governments,
      [PERMISSIONS_STATE_KEY]: permissions,
      [USERS_STATE_KEY]: users,
      [MODAL_STATE_KEY]: modal,
      [EXPENDITURES_STATE_KEY]: expenditures,
      [SUMMARY_STATE_KEY]: summary,
      [PAST_CONTRIBUTIONS_STATE_KEY]: pastContributions,
      [PUBLIC_DATA_STATE_KEY]: publicData,
      [EXTERNAL_DATA_STATE_KEY]: externalData,
    }),
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk.withExtraArgument({ api, schema }),
        flashMiddleware()
      ),
      storeEnhancer
    )
  );
}
