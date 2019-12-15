/* eslint-disable no-unused-vars */
import { createSelector } from 'reselect';
import { isAfter, isBefore, isEqual } from 'date-fns';
import createReducer from '../utils/createReducer';
import createActionTypes from '../utils/createActionTypes';
import action from '../utils/action';
import { RESET_STATE, resetState } from './common';

export const STATE_KEY = 'publicData';

const isInclusiveAfter = (date, compare) =>
  isEqual(date, compare) || isAfter(date, compare);

const isInclusiveBefore = (date, compare) =>
  isEqual(date, compare) || isBefore(date, compare);

const numericSort = (a, b) => a - b;

const median = arr => {
  if (!arr || !arr.length) return null;

  arr.sort(numericSort);

  if (arr.length % 2 === 0) {
    const a = arr[arr.length / 2 - 1];
    const b = arr[arr.length / 2];
    return (a + b) / 2;
  }

  return arr[Math.floor(arr.length / 2)];
};

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
export const allPublicData = createSelector(
  rootState,
  state => state[STATE_KEY] || {}
);

export const publicDataRequest = createSelector(
  allPublicData,
  state => {
    const { data, isLoading, error } = state;
    return { data, isLoading, error };
  }
);

export const publicDataFilters = createSelector(
  allPublicData,
  state => state.filters
);

export const publicDataGeojson = createSelector(
  publicDataRequest,
  req => {
    const data = req.data;
    if (!data.features) return data;

    // Convert date strings to Date objects
    data.features.forEach(f => {
      if (f.properties.date) {
        f.properties.date = new Date(f.properties.date);
      }
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
        f =>
          isInclusiveAfter(f.properties.date, start) &&
          isInclusiveBefore(f.properties.date, end)
      );
    } else if (start) {
      dataCopy.features = dataCopy.features.filter(f =>
        isInclusiveAfter(f.properties.date, start)
      );
    } else if (end) {
      dataCopy.features = dataCopy.features.filter(f =>
        isInclusiveBefore(f.properties.date, end)
      );
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

// Done: summary data includes aggregations and averages
// - number of donors
// - number of donations
// - median contribution size (exclude OAE type public match)
// - total amount contributed (by campaign?)
// - total amount matched (requires explanatory text since it won't be exactly 6x)
export const summaryData = createSelector(
  filteredPublicData,
  ({ features }) => {
    const donationsCount = features.length;

    const nonOAEContributions = [];
    const markedDonors = {};
    let donorsCount = 0;
    let totalAmountContributed = 0;
    let totalAmountMatched = 0;

    // Only iterate over the array once for better performance
    features.forEach(({ properties: props }) => {
      // NOTE: contributor name is not a strong idenfitier, could result in miscounting
      if (!markedDonors[props.contributorName]) {
        donorsCount += 1;
        markedDonors[props.contributorName] = true;
      }

      // Guard against bad data
      if (+props.amount === props.amount && props.amount >= 0) {
        totalAmountContributed += props.amount;
        if (props.oaeType !== 'public_matching_contribution') {
          nonOAEContributions.push(props.amount);
        }
      }

      if (+props.matchAmount === props.matchAmount && props.matchAmount >= 0) {
        totalAmountMatched += props.matchAmount;
      }
    });

    return {
      donationsCount,
      donorsCount,
      totalAmountContributed,
      totalAmountMatched,
      medianContributionSize: median(nonOAEContributions),
    };
  }
);

const sortedDonations = createSelector(
  filteredPublicData,
  data => {
    const donations = data.features.map(f => f.properties);
    donations.sort((a, b) => a.amount - b.amount);
    return donations;
  }
);

// Done: aggregate donation amounts by binned donations ranges
// - micro ($0-25)
// - small ($25-100)
// - medium ($100-250)
// - large ($250-1000)
// - mega ($1000+)
// For each bucket include three properties ({ name: 'micro', count: number of donations, total: sum of donations})
export const donationSizeByDonationRange = createSelector(
  sortedDonations,
  donations => {
    const aggregates = {
      micro: {
        total: 0,
        contributions: [],
      },
      small: {
        total: 0,
        contributions: [],
      },
      medium: {
        total: 0,
        contributions: [],
      },
      large: {
        total: 0,
        contributions: [],
      },
      mega: {
        total: 0,
        contributions: [],
      },
    };

    const markers = ['micro', 'small', 'medium', 'large', 'mega'];
    const breakpoints = [25, 100, 250, 1000];

    let index = 0;
    let marker = markers[index];
    let breakpoint = breakpoints[index];

    donations.forEach(d => {
      // Skip non-numeric values
      if (+d.amount !== d.amount) return;

      if (d.amount >= breakpoint) {
        while (d.amount >= breakpoint) {
          index += 1;
          marker = markers[index];
          if (index >= breakpoints.length) {
            breakpoint = Number.MAX_VALUE;
            break;
          }
          breakpoint = breakpoints[index];
        }
      }

      aggregates[marker].total += d.amount;
      aggregates[marker].contributions.push(d.amount);
    });

    return aggregates;
  }
);

// TODO: count of and sum of donations for each contributor type
// (individual, business, family, labor, political_committee, political_party, unregistered, other)
// For each type include three properties ({ type: 'individual', count: number of donations, total: sum of donations })
// Note: pad out the rest of the map with zeroes for each type that isn't represented in the data
export const aggregatedContributorTypes = createSelector(
  sortedDonations,
  donations => {
    const aggregates = [
      'individual',
      'business',
      'family',
      'labor',
      'political_committee',
      'political_party',
      'unregistered',
      'other',
    ].reduce((agg, type) => {
      agg[type] = {
        total: 0,
        contributions: [],
      };
      return agg;
    }, {});

    donations.forEach(d => {
      const bucket = aggregates[d.contributorType || 'other'];
      bucket.total += d.amount;
      bucket.contributions.push(d.amount);
    });

    return aggregates;
  }
);

// TODO: count of and sum of donations for each contribution type
// (cash, inkind, other)
// Same as above data shape
export const aggregatedContributionTypes = createSelector(
  sortedDonations,
  donations => {
    const aggregates = ['cash', 'inkind', 'other'].reduce((agg, type) => {
      agg[type] = {
        total: 0,
        contributions: [],
      };
      return agg;
    }, {});

    donations.forEach(d => {
      let type = 'other';
      if (d.contributionSubType === 'cash') type = 'cash';
      if ((d.contributionSubType || '').startsWith('inkind_')) type = 'inkind';

      const bucket = aggregates[type];
      bucket.total += d.amount;
      bucket.contributions.push(d.amount);
    });

    return aggregates;
  }
);

// TODO: count and sum of donations for each region
// (portland, oregon, outside)
// Note: filter out OAE subtype public_matching
// Note: do not include portland in oregon
export const aggregatedContributionsByRegion = createSelector(
  sortedDonations,
  donations => {
    const aggregates = ['portland', 'oregon', 'outside'].reduce((agg, type) => {
      agg[type] = {
        total: 0,
        contributions: [],
      };
      return agg;
    }, {});

    donations.forEach(d => {
      let type = 'outside';
      if ((d.state || '').toUpperCase() === 'OR') {
        type = 'oregon';
        // NOTE: this is a strict address match. If we want to include the entire metro area,
        // it would probably be better to check against a set of zipcodes or something.
        if ((d.city || '').toUpperCase() === 'PORTLAND') type = 'portland';
      }

      const bucket = aggregates[type];
      bucket.total += d.amount;
      bucket.contributions.push(d.amount);
    });

    return aggregates;
  }
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
