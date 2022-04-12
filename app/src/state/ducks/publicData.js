/* eslint-disable no-unused-vars */
import { createSelector } from 'reselect';
import { isAfter, isBefore, isEqual } from 'date-fns';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { fromPairs } from 'lodash';
import createReducer from '../utils/createReducer';
import createActionTypes, {
  createCustomActionTypes,
} from '../utils/createActionTypes';
import action from '../utils/action';
import { RESET_STATE, resetState } from './common';
import campaigns from './campaigns';

const { titleCase } = civicFormat;
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

const groupBy = (field, list) => {
  const groups = {};
  list.forEach(d => {
    // Skip datapoints that do not have the field in question
    if (!d[field]) return;

    if (!groups[d[field]]) {
      groups[d[field]] = [d];
    } else {
      groups[d[field]].push(d);
    }
  });

  return groups;
};

const makeArray = input => {
  if (input instanceof Array) return input;
  if (input == null) return [];
  return [input];
};

// Action Types
export const actionTypes = {
  GET_PUBLIC_DATA: createActionTypes(STATE_KEY, 'GET_PUBLIC_DATA'),
  GET_EXTERNAL_PUBLIC_DATA: createActionTypes(
    STATE_KEY,
    'GET_EXTERNAL_PUBLIC_DATA'
  ),
  SET_FILTER: createCustomActionTypes(STATE_KEY, 'SET_FILTER', [
    'OFFICES',
    'FINANCING',
    'CAMPAIGNS',
    'START_DATE',
    'END_DATE',
    'COUNT',
    'COMPARE',
    'RESET_ALL',
    'CUSTOM',
  ]),
};

// Initial State
export const initialState = {
  data: {
    type: 'FeatureCollection',
    features: [],
  },
  externalData: {
    type: 'FeatureCollection',
    features: [],
  },
  filters: {
    financing: 'public',
    campaigns: [],
    offices: [],
    startDate: null,
    endDate: null,
    count: false,
    compare: false,
  },
  isLoading: false,
  isExternalLoading: false,
  error: null,
  externalError: null,
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
    return {
      ...state,
      isLoading: false,
      data: action.payload,
      timeLoaded: new Date(),
    };
  },
  [actionTypes.GET_PUBLIC_DATA.FAILURE]: (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  },
  [actionTypes.GET_EXTERNAL_PUBLIC_DATA.REQUEST]: state => {
    return { ...state, isExternalLoading: true };
  },
  [actionTypes.GET_EXTERNAL_PUBLIC_DATA.SUCCESS]: (state, action) => {
    return {
      ...state,
      isExternalLoading: false,
      externalData: action.payload,
    };
  },
  [actionTypes.GET_EXTERNAL_PUBLIC_DATA.FAILURE]: (state, action) => {
    return { ...state, isExternalLoading: false, externalError: action.error };
  },
  [actionTypes.SET_FILTER.OFFICES]: (state, action) => {
    return {
      ...state,
      filters: { ...state.filters, offices: makeArray(action.offices) },
    };
  },
  [actionTypes.SET_FILTER.FINANCING]: (state, action) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        financing: action.financing,
        compare: false,
      },
    };
  },
  [actionTypes.SET_FILTER.CAMPAIGNS]: (state, action) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        campaigns: makeArray(action.campaigns),
        compare: makeArray(action.campaigns).length > 1,
      },
    };
  },
  [actionTypes.SET_FILTER.START_DATE]: (state, action) => {
    return {
      ...state,
      filters: { ...state.filters, startDate: action.startDate },
    };
  },
  [actionTypes.SET_FILTER.END_DATE]: (state, action) => {
    return { ...state, filters: { ...state.filters, endDate: action.endDate } };
  },
  [actionTypes.SET_FILTER.COUNT]: (state, action) => {
    return { ...state, filters: { ...state.filters, count: action.count } };
  },
  [actionTypes.SET_FILTER.COMPARE]: (state, action) => {
    return { ...state, filters: { ...state.filters, compare: action.compare } };
  },
  [actionTypes.SET_FILTER.RESET_ALL]: state => {
    return {
      ...state,
      filters: {
        financing: 'public',
        campaigns: [],
        offices: [],
        startDate: null,
        endDate: null,
        count: false,
        compare: false,
      },
    };
  },
  [actionTypes.SET_FILTER.CUSTOM]: (state, action) => {
    return {
      ...state,
      filters: {
        financing: 'public',
        campaigns: [],
        offices: [],
        startDate: null,
        endDate: null,
        count: false,
        compare: false,
        ...action.filters,
      },
    };
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
  getExternalPublicData: {
    request: () => action(actionTypes.GET_EXTERNAL_PUBLIC_DATA.REQUEST),
    success: payload =>
      action(actionTypes.GET_EXTERNAL_PUBLIC_DATA.SUCCESS, { payload }),
    failure: error =>
      action(actionTypes.GET_EXTERNAL_PUBLIC_DATA.FAILURE, { error }),
  },
  setFilter: {
    offices: offices => action(actionTypes.SET_FILTER.OFFICES, { offices }),
    financing: financing =>
      action(actionTypes.SET_FILTER.FINANCING, { financing }),
    campaigns: campaigns =>
      action(actionTypes.SET_FILTER.CAMPAIGNS, { campaigns }),
    startDate: startDate =>
      action(actionTypes.SET_FILTER.START_DATE, { startDate }),
    endDate: endDate => action(actionTypes.SET_FILTER.END_DATE, { endDate }),
    count: count => action(actionTypes.SET_FILTER.COUNT, { count }),
    compare: compare => action(actionTypes.SET_FILTER.COMPARE, { compare }),
    resetAll: () => action(actionTypes.SET_FILTER.RESET_ALL),
    custom: filters => action(actionTypes.SET_FILTER.CUSTOM, { filters }),
  },
};

export const setSelectedOffices = actionCreators.setFilter.offices;
export const setSelectedFinancing = actionCreators.setFilter.financing;
export const setSelectedCampaigns = actionCreators.setFilter.campaigns;
export const setSelectedStartDate = actionCreators.setFilter.startDate;
export const setSelectedEndDate = actionCreators.setFilter.endDate;
export const setSelectedCount = actionCreators.setFilter.count;
export const setSelectedCompare = actionCreators.setFilter.compare;
export const resetAll = actionCreators.setFilter.resetAll;
export const setCustomFilters = actionCreators.setFilter.custom;

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

export function getExternalPublicData() {
  return async (dispatch, getState, { api, schema }) => {
    dispatch(actionCreators.getExternalPublicData.request());
    try {
      const response = await api.getExternalContributionGeoData();
      dispatch(actionCreators.getExternalPublicData.success(response));
    } catch (error) {
      dispatch(actionCreators.getExternalPublicData.failure(error));
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
    const { data, isLoading, error, timeLoaded } = state;
    return { data, isLoading, error, timeLoaded };
  }
);

export const externalPublicDataRequest = createSelector(
  allPublicData,
  state => {
    const { externalData, isExternalLoading, externalError } = state;
    return { externalData, isExternalLoading, externalError };
  }
);

export const publicDataRequestIsLoading = createSelector(
  allPublicData,
  state => {
    const { isLoading, isExternalLoading } = state;
    return !(!isLoading && !isExternalLoading);
  }
);

export const publicDataFilters = createSelector(
  allPublicData,
  state => state.filters
);

export const mostRecentExternalContributionDate = createSelector(
  externalPublicDataRequest,
  extReq => {
    const externalData = extReq.externalData;
    // Return undefined if no external contributions
    if (!externalData.features) return undefined;
    if (externalData.features.length < 1) return undefined;

    // Convert date strings to Date objects
    externalData.features.forEach(f => {
      if (f.properties.date) {
        f.properties.date = new Date(f.properties.date);
        // force date to be PDT timezone
        f.properties.date.setUTCHours(7);
      }
    });

    // Create a shallow copy of the combined Geojson and sort latest date
    const dataCopy = { ...externalData };
    dataCopy.features = externalData.features.slice();

    const donations = dataCopy.features.map(f => f.properties);
    donations.sort((a, b) => b.date - a.date);
    const mostRecentDonationDate = donations[0].date;

    return mostRecentDonationDate;
  }
);

export const publicDataGeojson = createSelector(
  publicDataRequest,
  externalPublicDataRequest,
  (req, extReq) => {
    const data = req.data;
    if (!data.features) return data;
    const externalData = extReq.externalData;
    if (!externalData.features) return externalData;

    // Convert date strings to Date objects
    data.features.forEach(f => {
      if (f.properties.date) {
        f.properties.date = new Date(f.properties.date);
      }
    });

    // Convert date strings to Date objects and set match to 0
    externalData.features.forEach(f => {
      if (f.properties.date) {
        f.properties.date = new Date(f.properties.date);
      }
      f.properties.oaeType = 'not participating';
      f.properties.matchAmount = null;
    });

    // Create a shallow copy of the combined Geojson
    const dataCopy = { ...data };
    dataCopy.features = data.features
      .slice()
      .concat(externalData.features.slice());

    return dataCopy;
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
      const { campaignName, officeSought } = f.properties;
      campaigns[f.properties.campaignId] = { campaignName, officeSought };
      return campaigns;
    }, {});

    return Object.keys(campaignHash).map(id => ({
      id,
      name: campaignHash[id].campaignName,
      officeSought: campaignHash[id].officeSought,
    }));
  }
);

// Filter selections

export const selectedOffices = createSelector(
  publicDataFilters,
  filters => filters.offices || []
);

export const selectedFinancing = createSelector(
  publicDataFilters,
  filters => filters.financing
);

export const selectedCampaigns = createSelector(
  publicDataFilters,
  filters => filters.campaigns || []
);

export const selectedCampaignNames = createSelector(
  selectedCampaigns,
  campaigns => campaigns.map(campaign => campaign.name)
);

export const selectedStartDate = createSelector(
  publicDataFilters,
  filters =>
    typeof filters.startDate === 'string'
      ? new Date(filters.startDate)
      : filters.startDate
);

export const selectedEndDate = createSelector(
  publicDataFilters,
  filters =>
    typeof filters.endDate === 'string'
      ? new Date(filters.endDate)
      : filters.endDate
);

export const selectedCount = createSelector(
  publicDataFilters,
  filters => filters.count
);

export const selectedCompare = createSelector(
  publicDataFilters,
  filters => filters.compare
);

// Filtered filter options

export const availableCampaigns = createSelector(
  allCampaigns,
  selectedOffices,
  (campaigns, offices) => {
    if (!offices || !offices.length) return campaigns;

    return campaigns.filter(campaign =>
      offices.includes(campaign.officeSought)
    );
  }
);

export const availableCampaignNames = createSelector(
  availableCampaigns,
  campaigns => campaigns.map(campaign => campaign.name)
);

// The only non-participating candidate this election cycle is Ted Wheeler
const participatingCandidate = f => f.properties.campaignName !== 'Ted Wheeler';

const nonParticipatingCandidate = f =>
  f.properties.campaignName === 'Ted Wheeler';
// Filtered public dataset (based on above filters)

export const filteredPublicData = createSelector(
  publicDataGeojson,
  selectedOffices,
  selectedFinancing,
  selectedCampaigns,
  selectedStartDate,
  selectedEndDate,
  (data, offices, financing, campaigns, start, end) => {
    const campaignIds = campaigns.map(c => +c.id);
    // Create a shallow copy of the underlying Geojson
    const dataCopy = { ...data };
    dataCopy.features = dataCopy.features.slice();

    // Filter data starting with the fastest, broadest filters first
    if (campaigns.length) {
      dataCopy.features = dataCopy.features.filter(f =>
        campaignIds.includes(+f.properties.campaignId)
      );
    }

    if (offices.length) {
      dataCopy.features = dataCopy.features.filter(f =>
        offices.includes(f.properties.officeSought)
      );
    }

    if (financing !== 'all') {
      if (financing === 'public') {
        dataCopy.features = dataCopy.features.filter(participatingCandidate);
      }
      if (financing === 'private') {
        dataCopy.features = dataCopy.features.filter(nonParticipatingCandidate);
      }
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

    // filter out public_matching_contributions
    dataCopy.features = dataCopy.features.filter(
      f => f.properties.oaeType !== 'public_matching_contribution'
    );

    return dataCopy;
  }
);

// Aggregated data per chart

// Done: map takes Geojson of the filtered donations
export const mapData = createSelector(
  filteredPublicData,
  data => data
);

const addParticipatingStatus = (data, status) => {
  return { ...data, participatingStatus: status };
};

export const filteredPublicDataParticipatingOnly = createSelector(
  filteredPublicData,
  data => {
    // Create a shallow copy of the underlying Geojson
    const dataCopy = { ...data };
    dataCopy.features = dataCopy.features.slice();
    // Filter out non-participating candidates
    dataCopy.features = dataCopy.features.filter(participatingCandidate);
    return dataCopy;
  }
);

export const filteredPublicDataNonParticipatingOnly = createSelector(
  filteredPublicData,
  data => {
    // Create a shallow copy of the underlying Geojson
    const dataCopy = { ...data };
    dataCopy.features = dataCopy.features.slice();
    // Filter for non-participating candidates
    dataCopy.features = dataCopy.features.filter(nonParticipatingCandidate);
    return dataCopy;
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

const sortedDonationsNonParticipatingOnly = createSelector(
  filteredPublicDataNonParticipatingOnly,
  data => {
    const donations = data.features.map(f => f.properties);
    donations.sort((a, b) => a.amount - b.amount);
    return donations;
  }
);

const sortedDonationsParticipatingOnly = createSelector(
  filteredPublicDataParticipatingOnly,
  data => {
    const donations = data.features.map(f => f.properties);
    donations.sort((a, b) => a.amount - b.amount);
    return donations;
  }
);

export const sortedDonationsByCandidate = createSelector(
  filteredPublicData,
  selectedCampaignNames,
  (data, campaigns) => {
    const campaignDonations = {};
    campaigns.map(campaign => {
      const donations = data.features
        .filter(f => f.properties.campaignName === campaign)
        .map(f => f.properties);
      donations.sort((a, b) => a.amount - b.amount);
      campaignDonations[campaign] = donations;
      return {};
    });
    return campaignDonations;
  }
  // returns an array of donation for each candidate

  // want to return a keyed object based on candidate name
  // { ted: donations, sarah: donations }
);

const summarize = donations => {
  const donationsCount = donations.length;

  const nonOAEContributions = [];
  const markedDonors = {};
  const markedCampaigns = {};
  let donorsCount = 0;
  let totalAmountContributed = 0;
  let totalAmountMatched = 0;
  let campaignsCount = 0;

  // Only iterate over the array once for better performance
  donations.forEach(d => {
    // NOTE: contributor name is not a strong idenfitier, could result in miscounting
    // NOTE: Count each "Miscellaneous Cash Contributions $100 and under " as one donor

    if (
      !markedDonors[d.contributorName] ||
      d.contributorName === 'Miscellaneous Cash Contributions $100 and under '
    ) {
      donorsCount += 1;
      markedDonors[d.contributorName] = true;
    }

    if (!markedCampaigns[d.campaignName]) {
      campaignsCount += 1;
      markedCampaigns[d.campaignName] = true;
    }

    // Guard against bad data
    if (+d.amount === d.amount && d.amount >= 0) {
      totalAmountContributed += d.amount;
      if (d.oaeType !== 'public_matching_contribution') {
        nonOAEContributions.push(d.amount);
      }
    }

    if (+d.matchAmount === d.matchAmount && d.matchAmount >= 0) {
      totalAmountMatched += d.matchAmount;
    }
  });

  return {
    campaignsCount,
    donationsCount,
    donorsCount,
    totalAmountContributed,
    totalAmountMatched,
    medianContributionSize: median(nonOAEContributions),
  };
};

// Done: summary data includes aggregations and averages
// - number of campaigns
// - number of donors
// - number of donations
// - median contribution size (exclude OAE type public match)
// - total amount contributed (by campaign?)
// - total amount matched (requires explanatory text since it won't be exactly 6x)

export const summaryData = createSelector(
  sortedDonations,
  donations => summarize(donations)
);

export const summaryDataByParticipation = createSelector(
  sortedDonationsParticipatingOnly,
  sortedDonationsNonParticipatingOnly,
  (participatingDonations, nonParticipatingDonations) => {
    const summaryData = [];
    participatingDonations.length > 0 &&
      summaryData.push(
        addParticipatingStatus(summarize(participatingDonations), true)
      );
    nonParticipatingDonations.length > 0 &&
      summaryData.push(
        addParticipatingStatus(summarize(nonParticipatingDonations), false)
      );
    return summaryData;
  }
);

const bracketize = donations => {
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

    if (d.amount > breakpoint) {
      while (d.amount > breakpoint) {
        index += 1;
        marker = markers[index];
        if (index >= breakpoints.length) {
          breakpoint = Number.MAX_VALUE;
          break;
        }
        breakpoint = breakpoints[index];
      }
    }

    // Categorize "Miscellaneous Cash Contributions $100 and under" in the 25-100 category
    if (
      d.contributorName === 'Miscellaneous Cash Contributions $100 and under '
    ) {
      aggregates.small.total += d.amount;
      aggregates.small.contributions.push(d.amount);
      return;
    }

    aggregates[marker].total += d.amount;
    aggregates[marker].contributions.push(d.amount);
  });

  return aggregates;
};

// Done: aggregate donation amounts by binned donations ranges
// - micro ($0-25)
// - small ($25-100)
// - medium ($100-250)
// - large ($250-1000)
// - mega ($1000+)
// For each bucket include three properties ({ name: 'micro', count: number of donations, total: sum of donations})
export const donationSizeByDonationRange = createSelector(
  sortedDonations,
  donations => bracketize(donations)
);

export const donationSizeByDonationRangeByCandidate = createSelector(
  sortedDonationsByCandidate,
  candidateDonations =>
    fromPairs(
      Object.entries(candidateDonations).map(entry => [
        entry[0],
        bracketize(entry[1]),
      ])
    )
);

const aggregateDonationsBySize = aggregates => {
  const markers = ['micro', 'small', 'medium', 'large', 'mega'];
  const labels = ['<$25', '$25-$100', '$100-$250', '$250-$1000', '>$1000'];
  const summarizedAggregates = markers.map((category, index) => {
    return {
      type: category,
      formattedType: labels[index],
      total: aggregates[category].total,
      contributions: aggregates[category].contributions,
      count: aggregates[category].contributions.length,
    };
  });
  return summarizedAggregates;
};

export const aggregatedDonationSize = createSelector(
  donationSizeByDonationRange,
  aggregateDonationsBySize
);

export const aggregatedDonationSizeByCandidate = createSelector(
  donationSizeByDonationRangeByCandidate,
  candidateDonations => {
    if (Object.keys(candidateDonations).length < 1) {
      return [];
    }
    return fromPairs(
      Object.entries(candidateDonations).map(entry => [
        entry[0],
        aggregateDonationsBySize(entry[1]),
      ])
    );
  }
);

// Done: count of and sum of donations for each contributor type
// (individual, business, family, labor, political_committee, political_party, unregistered, other)
// For each type include three properties ({ type: 'individual', count: number of donations, total: sum of donations })
// Note: pad out the rest of the map with zeroes for each type that isn't represented in the data
const aggregateDonationsByContributorType = donations => {
  const categories = [
    'individual',
    'business',
    'family',
    'labor',
    'political_committee',
    'political_party',
    'unregistered',
    'other',
  ];
  const aggregates = categories.reduce((agg, type) => {
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

  const summarizedAggregates = categories.map(category => {
    return {
      type: category,
      label: titleCase(category),
      total: aggregates[category].total,
      contributions: aggregates[category].contributions,
      count: aggregates[category].contributions.length,
    };
  });

  return summarizedAggregates;
};

export const aggregatedContributorTypes = createSelector(
  sortedDonations,
  aggregateDonationsByContributorType
);

export const aggregatedContributorTypesByCandidate = createSelector(
  sortedDonationsByCandidate,
  candidateDonations => {
    if (Object.keys(candidateDonations).length < 1) {
      return [];
    }
    return fromPairs(
      Object.entries(candidateDonations).map(entry => [
        entry[0],
        aggregateDonationsByContributorType(entry[1]),
      ])
    );
  }
);

// Done: count of and sum of donations for each contribution type
// (cash, inkind, other)
// Same as above data shape
const aggregateDonationsByContributionType = donations => {
  const categories = ['cash', 'inkind', 'other'];
  const aggregates = categories.reduce((agg, type) => {
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

  const summarizedAggregates = categories.map(category => {
    return {
      type: category,
      formattedType: titleCase(category),
      total: aggregates[category].total,
      contributions: aggregates[category].contributions,
      count: aggregates[category].contributions.length,
    };
  });

  return summarizedAggregates;
};

export const aggregatedContributionTypes = createSelector(
  sortedDonations,
  aggregateDonationsByContributionType
);

export const aggregatedContributionTypesByCandidate = createSelector(
  sortedDonationsByCandidate,
  candidateDonations => {
    if (Object.keys(candidateDonations).length < 1) {
      return [];
    }
    return fromPairs(
      Object.entries(candidateDonations).map(entry => [
        entry[0],
        aggregateDonationsByContributionType(entry[1]),
      ])
    );
  }
);

// Done: count and sum of donations for each region
// (portland, oregon, outside)
// Note: filter out OAE subtype public_matching
// Note: do not include portland in oregon
const aggregateDonationsByRegion = donations => {
  const categories = ['portland', 'oregon', 'out_of_state'];
  const aggregates = categories.reduce((agg, type) => {
    agg[type] = {
      total: 0,
      contributions: [],
    };
    return agg;
  }, {});

  donations.forEach(d => {
    let type = 'out_of_state';
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

  const summarizedAggregates = categories.map(category => {
    return {
      type: category,
      label: titleCase(category),
      total: aggregates[category].total,
      contributions: aggregates[category].contributions,
      count: aggregates[category].contributions.length,
    };
  });

  return summarizedAggregates;
};

export const aggregatedContributionsByRegion = createSelector(
  sortedDonations,
  aggregateDonationsByRegion
);

export const aggregatedContributionsByRegionByCandidate = createSelector(
  sortedDonationsByCandidate,
  candidateDonations => {
    if (Object.keys(candidateDonations).length < 1) {
      return [];
    }
    return fromPairs(
      Object.entries(candidateDonations).map(entry => [
        entry[0],
        aggregateDonationsByRegion(entry[1]),
      ])
    );
  }
);

// Done: create a table that matches this format
// | Campaign Name | Total Amount | Total Donations | Total Match Amount | Micro | Small | Medium | Large | Mega |
// | ------------- | ------------ | --------------- | ------------------ | ----- | ----- | ------ | ----- | ---- |
// | One           | $1,234       | 29              | $20,444            | 15    | 12    | 1      | 1     | 0    |
// | Two           | $1,234       | 29              | $20,444            | 15    | 12    | 1      | 1     | 0    |
export const campaignsTable = createSelector(
  sortedDonations,
  donations => {
    const donationsByCampaign = groupBy('campaignId', donations);
    const campaigns = Object.keys(donationsByCampaign).map(k => ({
      campaignId: k,
      contributions: donationsByCampaign[k],
    }));

    campaigns.forEach(campaign => {
      Object.assign(
        campaign,
        summarize(campaign.contributions),
        bracketize(campaign.contributions)
      );

      // Pull common properties of a contribution up
      // to the campaign for convenience
      const contribution = campaign.contributions[0];
      campaign.campaignName = contribution.campaignName;
      campaign.officeSought = contribution.officeSought;
      campaign.participatingStatus =
        contribution.campaignName !== 'Ted Wheeler';
    });

    return campaigns;
  }
);
