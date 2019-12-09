/* eslint-disable no-unused-vars */
import { createSelector } from 'reselect';
import { isAfter, isBefore } from 'date-fns';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { RESET_STATE, resetState } from './common';

export const STATE_KEY = 'publicData';

// Action Types
export const actionTypes = {
  GET_PUBLIC_DATA: createActionTypes(STATE_KEY, 'GET_PUBLIC_DATA'),
};

// Initial State
export const initialState = {
  data: {
    type: 'FeatureCollection',
    features: [],
  },
  filters: {
    campaigns: [],
    offices: [],
    startDate: null,
    endDate: null,
  },
  isLoading: false,
  error: null,
};

// Reducer
export default createReducer(initialState, {
  [RESET_STATE]: () => {
    return { ...initialState };
  },
  [actionTypes.GET_PUBLIC_DATA.REQUEST]: state => {
    return { ...state, isLoading: true };
  },
  [actionTypes.GET_PUBLIC_DATA.SUCCESS]: (state, action) => {
    return { ...state, isLoading: false, data: action.payload };
  },
  [actionTypes.GET_PUBLIC_DATA.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
});

// Action Creators
export const actionCreators = {
  getPublicData: {
    request: () => action(actionTypes.GET_PUBLIC_DATA.REQUEST),
    success: payload =>
      action(actionTypes.GET_PUBLIC_DATA.SUCCESS, { payload }),
    failure: error => action(actionTypes.GET_PUBLIC_DATA.FAILURE, { error }),
  },
};

// Side Effects, e.g. thunks
export function getPublicData() {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getPublicData.request());
    try {
      const response = await api.getContributionGeoData();
      dispatch(actionCreators.getPublicData.success(response));
    } catch (error) {
      dispatch(actionCreators.getPublicData.failure(error));
    }
  };
}

export const rootState = state => state || {};
export const publicData = createSelector(
  rootState,
  state => state[STATE_KEY] || {}
);

export const publicDataRequest = createSelector(
  publicData,
  state => {
    const { data, isLoading, error } = state;
    return { data, isLoading, error };
  }
);

export const publicDataFilters = createSelector(
  publicData,
  state => state.filters
);

export const publicDataGeojson = createSelector(
  publicDataRequest,
  req => {
    const data = req.data;
    if (!data.features) return data;

    // Convert date strings to Date objects
    data.features.forEach(f => {
      f.properties.date = new Date(f.properties.date);
    });

    return data;
  }
);

// Filter Options (based off of the complete public dataset)

export const allOffices = createSelector(
  publicDataGeojson,
  json => {
    if (!json || !json.features) return [];

    const offices = new Set();
    json.features.forEach(f => {
      offices.add(f.properties.officeSought);
    });
    return Array.from(offices);
  }
);

export const allCampaigns = createSelector(
  publicDataGeojson,
  json => {
    if (!json || !json.features) return [];

    const campaignHash = json.features.reduce((campaigns, f) => {
      campaigns[f.properties.campaignId] = f.properties.campaignName;
      return campaigns;
    }, {});

    return Object.keys(campaignHash).map(id => ({
      id,
      name: campaignHash[id],
    }));
  }
);

// Filter selections

export const selectedOffices = createSelector(
  publicDataFilters,
  filters => filters.offices || []
);

export const selectedCampaigns = createSelector(
  publicDataFilters,
  filters => (filters.campaigns || []).map(c => c.id)
);

export const selectedStartDate = createSelector(
  publicDataFilters,
  filters => filters.startDate
);

export const selectedEndDate = createSelector(
  publicDataFilters,
  filters => filters.endDate
);

// Filtered public dataset (based on above filters)

export const filteredPublicData = createSelector(
  publicDataGeojson,
  selectedOffices,
  selectedCampaigns,
  selectedStartDate,
  selectedEndDate,
  (data, offices, campaigns, start, end) => {
    // Create a shallow copy of the underlying Geojson
    const dataCopy = { ...data };
    dataCopy.features = dataCopy.features.slice();

    // Filter data starting with the fastest, broadest filters first
    if (campaigns.length) {
      dataCopy.features = dataCopy.features.filter(f =>
        campaigns.includes(f.properties.campaignId)
      );
    }

    if (offices.length) {
      dataCopy.features = dataCopy.features.filter(f =>
        offices.includes(f.properties.officeSought)
      );
    }

    if (start && end) {
      dataCopy.features = dataCopy.features.filter(
        f => isAfter(f.date, start) && isBefore(f.date, end)
      );
    } else if (start) {
      dataCopy.features = dataCopy.features.filter(f => isAfter(f.date, start));
    } else if (end) {
      dataCopy.features = dataCopy.features.filter(f => isBefore(f.date, end));
    }

    return dataCopy;
  }
);

// Aggregated data per chart

// Done: map takes Geojson of the filtered donations
export const mapData = createSelector(
  filteredPublicData,
  data => data
);

// TODO: summary data includes aggregations and averages
// - number of donors
// - number of donations
// - median contribution size (exclude OAE type public match)
// - total amount contributed (by campaign?)
// - total amount matched (requires explanatory text since it won't be exactly 6x)
export const summaryData = createSelector(
  filteredPublicData,
  data => data
);

// TODO: aggregate donation amounts by binned donations ranges
// - micro ($0-25)
// - small ($25-100)
// - medium ($100-250)
// - large ($250-1000)
// - mega ($1000+)
// For each bucket include three properties ({ name: 'micro', count: number of donations, total: sum of donations})
export const donationSizeByDonationRange = createSelector(
  filteredPublicData,
  data => data
);

// TODO: count of and sum of donations for each contributor type
// (individual, business, family, labor, political_committee, political_party, unregistered, other)
// For each type include three properties ({ type: 'individual', count: number of donations, total: sum of donations })
// Note: pad out the rest of the map with zeroes for each type that isn't represented in the data
export const aggregatedContributorTypes = createSelector(
  filteredPublicData,
  data => data
);

// TODO: count of and sum of donations for each contribution type
// (cash, inkind, other)
// Same as above data shape
export const aggregatedContributionTypes = createSelector(
  filteredPublicData,
  data => data
);

// TODO: count and sum of donations for each region
// (portland, oregon, outside)
// Note: filter out OAE subtype public_matching
// Note: do not include portland in oregon
export const aggregatedContributionsByRegion = createSelector(
  filteredPublicData,
  data => data
);

// TODO: create a table that matches this format
// | Campaign Name | Total Amount | Total Donations | Total Match Amount | Micro | Small | Medium | Large | Mega |
// | ------------- | ------------ | --------------- | ------------------ | ----- | ----- | ------ | ----- | ---- |
// | One           | $1,234       | 29              | $20,444            | 15    | 12    | 1      | 1     | 0    |
// | Two           | $1,234       | 29              | $20,444            | 15    | 12    | 1      | 1     | 0    |
export const campaignsTable = createSelector(
  filteredPublicData,
  data => data
);
