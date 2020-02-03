import * as publicData from './publicData';

const { actionTypes } = publicData;

const makeData = (features = [], overrides = {}) => {
  const state = {
    [publicData.STATE_KEY]: {
      ...publicData.initialState,
      data: {
        type: 'FeatureCollection',
        features,
      },
      ...overrides,
    },
  };
  return [state, JSON.parse(JSON.stringify(state[publicData.STATE_KEY]))];
};

const point = (properties = {}, geometry = {}) => ({
  type: 'Feature',
  properties,
  geometry: {
    type: 'Point',
    coordinates: [-122.654, 45.516],
    ...geometry,
  },
});

describe('Reducer', () => {
  const reducer = publicData.default;

  describe('set campaigns', () => {
    it('sets the campaigns filter', () => {
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.CAMPAIGNS,
          campaigns: ['1', '2', '3'],
        }).filters
      ).toEqual({
        campaigns: ['1', '2', '3'],
        offices: [],
        startDate: null,
        endDate: null,
      });
    });

    it('is liberal with what it accepts', () => {
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.CAMPAIGNS,
          campaigns: null,
        }).filters
      ).toEqual({
        campaigns: [],
        offices: [],
        startDate: null,
        endDate: null,
      });

      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.CAMPAIGNS,
          campaigns: 'just-the-one',
        }).filters
      ).toEqual({
        campaigns: ['just-the-one'],
        offices: [],
        startDate: null,
        endDate: null,
      });
    });
  });

  describe('set offices', () => {
    it('sets the offices filter', () => {
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.OFFICES,
          offices: ['1', '2', '3'],
        }).filters
      ).toEqual({
        campaigns: [],
        offices: ['1', '2', '3'],
        startDate: null,
        endDate: null,
      });
    });

    it('is liberal with what it accepts', () => {
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.OFFICES,
          offices: null,
        }).filters
      ).toEqual({
        campaigns: [],
        offices: [],
        startDate: null,
        endDate: null,
      });

      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.OFFICES,
          offices: 'just-the-one',
        }).filters
      ).toEqual({
        campaigns: [],
        offices: ['just-the-one'],
        startDate: null,
        endDate: null,
      });
    });
  });

  describe('set start date', () => {
    it('sets the start date filter', () => {
      const date = new Date();
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.START_DATE,
          startDate: date,
        }).filters
      ).toEqual({
        campaigns: [],
        offices: [],
        startDate: date,
        endDate: null,
      });
    });
  });

  describe('set end date', () => {
    it('sets the end date filter', () => {
      const date = new Date();
      expect(
        reducer(publicData.initialState, {
          type: actionTypes.SET_FILTER.END_DATE,
          endDate: date,
        }).filters
      ).toEqual({
        campaigns: [],
        offices: [],
        startDate: null,
        endDate: date,
      });
    });
  });
});

describe('Selectors', () => {
  describe('allPublicData', () => {
    const [state, data] = makeData();

    it('returns the object at the module STATE_KEY', () => {
      expect(publicData.allPublicData(state)).toEqual(data);
    });
  });

  describe('publicDataFilters', () => {
    const [emptyState] = makeData();

    const filters = {
      campaigns: [1, 2, 3],
      offices: ['Mayor'],
      startDate: new Date().toISOString(),
      endDate: null,
    };
    const [stateWithSelections] = makeData([], { filters });

    it('returns the current filter selections', () => {
      expect(publicData.publicDataFilters(emptyState)).toEqual(
        publicData.initialState.filters
      );
      expect(publicData.publicDataFilters(stateWithSelections)).toEqual(
        filters
      );
    });
  });

  describe('publicDataRequest', () => {
    const [emptyState, emptyData] = makeData();
    const [stateWithData, dataWithData] = makeData(
      [
        point({ type: 'contribution', campaignId: 1 }),
        point({ type: 'contribution', campaignId: 2 }),
      ],
      {
        isLoading: false,
        error: null,
      }
    );

    it('returns the data, isLoading, and error states', () => {
      expect(publicData.publicDataRequest(emptyState)).toEqual({
        data: emptyData.data,
        isLoading: emptyData.isLoading,
        error: emptyData.error,
      });

      expect(publicData.publicDataRequest(stateWithData)).toEqual({
        data: dataWithData.data,
        isLoading: dataWithData.isLoading,
        error: dataWithData.error,
      });
    });
  });

  describe('publicDataGeojson', () => {
    it('returns just the data from the state tree', () => {
      const [state, data] = makeData();
      expect(publicData.publicDataGeojson(state)).toEqual(data.data);
    });

    it('converts date strings into Date objects where applicable', () => {
      const [state, data] = makeData([
        point({ date: '2019-12-14T04:02:09.416Z' }),
        point({ date: '2019-12-13T04:02:09.416Z' }),
        point({ date: '2019-12-12T04:02:09.416Z' }),
      ]);

      expect(publicData.publicDataGeojson(state)).not.toEqual(data.data);
      expect(
        publicData.publicDataGeojson(state).features.map(f => f.properties.date)
      ).toEqual(data.data.features.map(f => new Date(f.properties.date)));
    });
  });

  describe('allOffices', () => {
    it('returns an array of offices based on the data prop', () => {
      const [state] = makeData([
        point({ officeSought: 'Mayor' }),
        point({ officeSought: 'Commissioner 1' }),
        point({ officeSought: 'Commissioner 2' }),
      ]);

      expect(publicData.allOffices(state)).toEqual([
        'Mayor',
        'Commissioner 1',
        'Commissioner 2',
      ]);
    });

    it('does not return duplicate values', () => {
      const [state] = makeData([
        point({ officeSought: 'Mayor' }),
        point({ officeSought: 'Mayor' }),
        point({ officeSought: 'Mayor' }),
      ]);

      expect(publicData.allOffices(state)).toEqual(['Mayor']);
    });

    it('returns an empty array when there is no data', () => {
      const [state] = makeData();

      expect(publicData.allOffices(state)).toEqual([]);
    });
  });

  describe('allCampaigns', () => {
    it('returns an array of campaign objects, including ID and Name', () => {
      const campaigns = [
        { campaignId: '1', campaignName: 'Foo', officeSought: 'Mayor' },
        { campaignId: '2', campaignName: 'Bar', officeSought: 'Mayor' },
        { campaignId: '3', campaignName: 'Baz', officeSought: 'Commissioner' },
      ];
      const [state] = makeData(campaigns.map(point));

      expect(publicData.allCampaigns(state)).toEqual(
        campaigns.map(c => ({
          id: c.campaignId,
          name: c.campaignName,
          officeSought: c.officeSought,
        }))
      );
    });

    it('does not return duplicate values (based on ID, last name wins)', () => {
      const campaigns = [
        { campaignId: '1', campaignName: 'Foo 1', officeSought: 'Mayor' },
        { campaignId: '1', campaignName: 'Foo 2', officeSought: 'Mayor' },
        { campaignId: '2', campaignName: 'Bar 1', officeSought: 'Mayor' },
        { campaignId: '2', campaignName: 'Bar 2', officeSought: 'Mayor' },
        { campaignId: '3', campaignName: 'Foo 1', officeSought: 'Mayor' },
        { campaignId: '3', campaignName: 'Foo 2', officeSought: 'Mayor' },
      ];
      const [state] = makeData(campaigns.map(point));

      expect(publicData.allCampaigns(state)).toEqual([
        { id: '1', name: 'Foo 2', officeSought: 'Mayor' },
        { id: '2', name: 'Bar 2', officeSought: 'Mayor' },
        { id: '3', name: 'Foo 2', officeSought: 'Mayor' },
      ]);
    });

    it('returns an empty array when there is no data', () => {
      const [state] = makeData();

      expect(publicData.allCampaigns(state)).toEqual([]);
    });
  });

  describe('availableCampaigns', () => {
    const campaigns = [
      { campaignId: '1', campaignName: 'Foo', officeSought: 'First' },
      { campaignId: '2', campaignName: 'Bar', officeSought: 'Second' },
      { campaignId: '3', campaignName: 'Baz', officeSought: 'Third' },
    ];

    it('returns an array of all campaigns when there is no office filter selection', () => {
      const [state] = makeData(campaigns.map(point));
      expect(publicData.availableCampaigns(state)).toEqual([
        { id: '1', name: 'Foo', officeSought: 'First' },
        { id: '2', name: 'Bar', officeSought: 'Second' },
        { id: '3', name: 'Baz', officeSought: 'Third' },
      ]);
    });

    it('returns an array of only matching campaigns when there is an office filter selection', () => {
      const [state] = makeData(campaigns.map(point), {
        filters: {
          offices: ['First', 'Third'],
        },
      });
      expect(publicData.availableCampaigns(state)).toEqual([
        { id: '1', name: 'Foo', officeSought: 'First' },
        { id: '3', name: 'Baz', officeSought: 'Third' },
      ]);
    });
  });

  describe('filter selections', () => {
    const startDate = new Date();
    const endDate = new Date();

    const [state] = makeData([], {
      filters: {
        offices: ['Mayor', 'Test', 'Case'],
        campaigns: [
          { id: '1', name: 'One' },
          { id: '2', name: 'Four' },
          { id: '3', name: 'Three' },
        ],
        startDate,
        endDate,
      },
    });

    const [emptyState] = makeData([], {
      filters: {},
    });

    it('returns a list of offices for selectedOffices', () => {
      expect(publicData.selectedOffices(state)).toEqual([
        'Mayor',
        'Test',
        'Case',
      ]);
    });

    it('defaults to an empty array for selectedOffices', () => {
      expect(publicData.selectedOffices(emptyState)).toEqual([]);
    });

    it('returns a list of campaign IDs for selectedCampaigns', () => {
      expect(publicData.selectedCampaigns(state)).toEqual([
        { id: '1', name: 'One' },
        { id: '2', name: 'Four' },
        { id: '3', name: 'Three' },
      ]);
    });

    it('defaults to an empty array for selectedCampaigns', () => {
      expect(publicData.selectedCampaigns(emptyState)).toEqual([]);
    });

    it('returns a date for selectedStartDate', () => {
      expect(publicData.selectedStartDate(state)).toEqual(startDate);
    });

    it('returns a date for selectedEndDate', () => {
      expect(publicData.selectedEndDate(state)).toEqual(endDate);
    });
  });

  describe('filtered selectors', () => {
    const ids = d => d.properties.id;

    let incr = 0;
    const factory = staticProps => date => {
      incr += 1;
      return point({
        id: incr,
        date,
        ...staticProps,
      });
    };

    const campaign1 = factory({
      officeSought: 'Mayor',
      campaignId: '1',
      campaignName: 'One',
    });
    const campaign2 = factory({
      officeSought: 'Mayor',
      campaignId: '2',
      campaignName: 'Two',
    });
    const campaign3 = factory({
      officeSought: 'Commissioner 1',
      campaignId: '3',
      campaignName: 'Three',
    });
    const campaign4 = factory({
      officeSought: 'Commissioner 2',
      campaignId: '4',
      campaignName: 'Four',
    });

    const points = [
      campaign1('2019-12-01T04:02:09.416Z'),
      campaign1('2019-12-07T04:02:09.416Z'),
      campaign1('2019-12-14T04:02:09.416Z'),

      campaign2('2019-12-02T04:02:09.416Z'),
      campaign2('2019-12-08T04:02:09.416Z'),
      campaign2('2019-12-15T04:02:09.416Z'),

      campaign3('2019-12-03T04:02:09.416Z'),
      campaign3('2019-12-09T04:02:09.416Z'),
      campaign3('2019-12-16T04:02:09.416Z'),

      campaign4('2019-12-04T04:02:09.416Z'),
      campaign4('2019-12-10T04:02:09.416Z'),
      campaign4('2019-12-17T04:02:09.416Z'),
    ];

    describe('filteredPublicData', () => {
      it('returns all data when there is no active filter', () => {
        const [state] = makeData(points, {
          filters: {},
        });

        const { features } = publicData.filteredPublicData(state);
        expect(features).toHaveLength(points.length);
        expect(features.map(ids)).toEqual(points.map(ids));
      });

      it('returns all data matching any selected office', () => {
        const [singleState] = makeData(points, {
          filters: {
            offices: ['Mayor'],
          },
        });

        const [multiState] = makeData(points, {
          filters: {
            offices: ['Mayor', 'Commissioner 2'],
          },
        });

        const { features: singleFeatures } = publicData.filteredPublicData(
          singleState
        );
        const { features: multiFeatures } = publicData.filteredPublicData(
          multiState
        );

        expect(singleFeatures.map(ids)).toEqual([1, 2, 3, 4, 5, 6]);
        expect(multiFeatures.map(ids)).toEqual([1, 2, 3, 4, 5, 6, 10, 11, 12]);
      });

      it('returns all data matching any selected campaign', () => {
        const [singleState] = makeData(points, {
          filters: {
            campaigns: [{ id: '1', name: 'One' }],
          },
        });

        const [multiState] = makeData(points, {
          filters: {
            campaigns: [
              { id: '1', name: 'One' },
              { id: '3', name: 'Three' },
              { id: '4', name: 'Four' },
            ],
          },
        });

        const { features: singleFeatures } = publicData.filteredPublicData(
          singleState
        );
        const { features: multiFeatures } = publicData.filteredPublicData(
          multiState
        );

        expect(singleFeatures.map(ids)).toEqual([1, 2, 3]);
        expect(multiFeatures.map(ids)).toEqual([1, 2, 3, 7, 8, 9, 10, 11, 12]);
      });

      it('returns only data matching both selected campaigns AND selected offices', () => {
        const [state] = makeData(points, {
          filters: {
            campaigns: [{ id: '2', name: 'Two' }, { id: '4', name: 'Four' }],
            offices: ['Mayor', 'Commissioner 1'],
          },
        });

        const { features } = publicData.filteredPublicData(state);

        expect(features.map(ids)).toEqual([4, 5, 6]);
      });

      it('returns all data after or including the start date', () => {
        const [state] = makeData(points, {
          filters: {
            startDate: new Date('2019-12-10T04:02:09.416Z'),
          },
        });

        const { features } = publicData.filteredPublicData(state);
        expect(features.map(ids)).toEqual([3, 6, 9, 11, 12]);
      });

      it('returns all data before or including the end date', () => {
        const [state] = makeData(points, {
          filters: {
            endDate: new Date('2019-12-06T04:02:09.416Z'),
          },
        });

        const { features } = publicData.filteredPublicData(state);
        expect(features.map(ids)).toEqual([1, 4, 7, 10]);
      });

      it('returns only data within (inclusive) the start and end date', () => {
        const [state] = makeData(points, {
          filters: {
            startDate: new Date('2019-12-06T04:02:09.416Z'),
            endDate: new Date('2019-12-10T04:02:09.416Z'),
          },
        });

        const { features } = publicData.filteredPublicData(state);
        expect(features.map(ids)).toEqual([2, 5, 8, 11]);
      });

      it('returns only data within the start and end date matching both selected campaigns AND selected offices', () => {
        const [state] = makeData(points, {
          filters: {
            campaigns: [{ id: '2', name: 'Two' }, { id: '4', name: 'Four' }],
            offices: ['Mayor'],
            startDate: new Date('2019-12-03T04:02:09.416Z'),
            endDate: new Date('2019-12-14T04:02:09.416Z'),
          },
        });

        const { features } = publicData.filteredPublicData(state);
        expect(features.map(ids)).toEqual([5]);
      });
    });

    describe('mapData', () => {
      it('returns filteredPublicData, since it is already GeoJSON', () => {
        const [state] = makeData(points, {
          filters: {
            offices: ['Mayor'],
          },
        });

        expect(publicData.mapData(state)).toEqual({
          type: 'FeatureCollection',
          features: points.slice(0, 6),
        });
      });
    });
  });

  describe('summaryData', () => {
    const summaryPoint = (contributorName, amount, matchAmount, oaeType) =>
      point({ contributorName, amount, matchAmount, oaeType });

    const points = [
      summaryPoint('Abc', 10, null, 'allowable'),
      summaryPoint('Abc', 20, 120, 'matchable'),
      summaryPoint('Def', 30, 150, 'matchable'),
      summaryPoint('Ghi', 100, null, 'public_matching_contribution'),
      summaryPoint('Jkl', 5, 30, 'matchable'),
    ];

    const [state] = makeData(points);

    it('returns the total number of donations (excluding public_matching_contribution', () => {
      expect(publicData.summaryData(state).donationsCount).toEqual(
        points.length - 1
      );
    });

    it('returns the total number of donors (uniqued by contributor name, excluding public matching contribution)', () => {
      expect(publicData.summaryData(state).donorsCount).toEqual(3);
    });

    it('returns the total amount contributed (excluding public matching contributions) and the total amount matched', () => {
      const total = 10 + 20 + 30 + 5;
      const matchTotal = 120 + 150 + 30;
      expect(publicData.summaryData(state).totalAmountContributed).toEqual(
        total
      );
      expect(publicData.summaryData(state).totalAmountMatched).toEqual(
        matchTotal
      );
    });

    it('returns the median contribution size, excluding public_matching_contribution types', () => {
      // Contributions
      // [ 10, 20, 30, 100, 5.23 ]
      // Exclude public_matching_contribution types
      // [ 10, 20, 30, 5.23 ]
      // Sort
      // [ 5.23, 10, 20, 30 ]
      // Median (avg middle data points)
      // (10 + 20) / 2 = 15
      expect(publicData.summaryData(state).medianContributionSize).toEqual(15);
    });
  });

  describe('donationSizeByDonationRange', () => {
    it('buckets and summates donations appropriately', () => {
      const points = [
        point({ amount: 0 }),
        point({ amount: 5 }),
        point({ amount: 10 }),
        point({ amount: 20 }),
        point({ amount: 30 }),
        point({ amount: 50 }),
        point({ amount: 100 }),
        point({ amount: 150 }),
        point({ amount: 200 }),
        point({ amount: 500 }),
        point({ amount: 750 }),
        point({ amount: 1000 }),
        point({ amount: 2500 }),
      ];

      const [state] = makeData(points);

      expect(publicData.donationSizeByDonationRange(state)).toEqual({
        micro: {
          total: 0 + 5 + 10 + 20,
          contributions: [0, 5, 10, 20],
        },
        small: {
          total: 30 + 50 + 100,
          contributions: [30, 50, 100],
        },
        medium: {
          total: 150 + 200,
          contributions: [150, 200],
        },
        large: {
          total: 500 + 750 + 1000,
          contributions: [500, 750, 1000],
        },
        mega: {
          total: 2500,
          contributions: [2500],
        },
      });
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        point({ amount: 30 }),
        point({ amount: 50 }),
        point({ amount: 1000 }),
        point({ amount: 2500 }),
      ];

      const [state] = makeData(points);

      expect(publicData.donationSizeByDonationRange(state)).toEqual({
        micro: {
          total: 0,
          contributions: [],
        },
        small: {
          total: 30 + 50,
          contributions: [30, 50],
        },
        medium: {
          total: 0,
          contributions: [],
        },
        large: {
          total: 1000,
          contributions: [1000],
        },
        mega: {
          total: 2500,
          contributions: [2500],
        },
      });
    });
  });

  describe('aggregatedContributorTypes', () => {
    const summaryPoint = (contributorType, amount) =>
      point({ contributorType, amount });

    it('buckets and summates donations appropriately', () => {
      const points = [
        summaryPoint('individual', 10),
        summaryPoint('individual', 15),
        summaryPoint('business', 100),
        summaryPoint('business', 1450),
        summaryPoint('business', 890),
        summaryPoint('family', 50),
        summaryPoint('labor', 500),
        summaryPoint('political_committee', 30),
        summaryPoint('political_party', 100),
        summaryPoint('unregistered', 150),
        summaryPoint('other', 10),
        summaryPoint(null, 9),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributorTypes(state)).toEqual([
        {
          type: 'individual',
          label: 'Individual',
          total: 10 + 15,
          contributions: [10, 15],
          count: 2,
        },
        {
          type: 'business',
          label: 'Business',
          total: 100 + 1450 + 890,
          contributions: [100, 890, 1450],
          count: 3,
        },
        {
          type: 'family',
          label: 'Family',
          total: 50,
          contributions: [50],
          count: 1,
        },
        {
          type: 'labor',
          label: 'Labor',
          total: 500,
          contributions: [500],
          count: 1,
        },
        {
          type: 'political_committee',
          label: 'Political Committee',
          total: 30,
          contributions: [30],
          count: 1,
        },
        {
          type: 'political_party',
          label: 'Political Party',
          total: 100,
          contributions: [100],
          count: 1,
        },
        {
          type: 'unregistered',
          label: 'Unregistered',
          total: 150,
          contributions: [150],
          count: 1,
        },
        {
          type: 'other',
          label: 'Other',
          total: 9 + 10,
          contributions: [9, 10],
          count: 2,
        },
      ]);
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        summaryPoint('individual', 10),
        summaryPoint('individual', 15),
        summaryPoint('business', 100),
        summaryPoint('business', 1450),
        summaryPoint('business', 890),
        summaryPoint('unregistered', 150),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributorTypes(state)).toEqual([
        {
          type: 'individual',
          label: 'Individual',
          total: 10 + 15,
          contributions: [10, 15],
          count: 2,
        },
        {
          type: 'business',
          label: 'Business',
          total: 100 + 1450 + 890,
          contributions: [100, 890, 1450],
          count: 3,
        },
        {
          type: 'family',
          label: 'Family',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'labor',
          label: 'Labor',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'political_committee',
          label: 'Political Committee',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'political_party',
          label: 'Political Party',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'unregistered',
          label: 'Unregistered',
          total: 150,
          contributions: [150],
          count: 1,
        },
        {
          type: 'other',
          label: 'Other',
          total: 0,
          contributions: [],
          count: 0,
        },
      ]);
    });
  });

  describe('aggregatedContributionTypes', () => {
    const summaryPoint = (contributionSubType, amount) =>
      point({ contributionSubType, amount });

    it('buckets and summates donations appropriately', () => {
      const points = [
        summaryPoint('cash', 10),
        summaryPoint('cash', 14),
        summaryPoint('inkind_onefish', 40),
        summaryPoint('inkind_2_fish', 95),
        summaryPoint('inkind_redfish', 100),
        summaryPoint('inkind_bluefish', 139),
        summaryPoint('other', 10),
        summaryPoint('nothing', 25),
        summaryPoint(null, 5),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionTypes(state)).toEqual([
        {
          type: 'cash',
          formattedType: 'Cash',
          total: 10 + 14,
          contributions: [10, 14],
          count: 2,
        },
        {
          type: 'inkind',
          formattedType: 'Inkind',
          total: 40 + 95 + 100 + 139,
          contributions: [40, 95, 100, 139],
          count: 4,
        },
        {
          type: 'other',
          formattedType: 'Other',
          total: 10 + 25 + 5,
          contributions: [5, 10, 25],
          count: 3,
        },
      ]);
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        summaryPoint('inkind_onefish', 40),
        summaryPoint('inkind_2_fish', 95),
        summaryPoint('inkind_redfish', 100),
        summaryPoint('inkind_bluefish', 139),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionTypes(state)).toEqual([
        {
          type: 'cash',
          formattedType: 'Cash',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'inkind',
          formattedType: 'Inkind',
          total: 40 + 95 + 100 + 139,
          contributions: [40, 95, 100, 139],
          count: 4,
        },
        {
          type: 'other',
          formattedType: 'Other',
          total: 0,
          contributions: [],
          count: 0,
        },
      ]);
    });
  });

  describe('aggregatedContributionsByRegion', () => {
    const summaryPoint = (city, state, amount) =>
      point({ city, state, amount });

    it('buckets and summates donations appropriately', () => {
      const points = [
        summaryPoint('portland', 'or', 10),
        summaryPoint('portland', 'or', 25),
        summaryPoint('portland', 'me', 200),
        summaryPoint('eugene', 'or', 100),
        summaryPoint('gresham', 'or', 25),
        summaryPoint('wamic', 'or', 100),
        summaryPoint('culver', 'or', 50),
        summaryPoint('new york city', 'ny', 1000),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionsByRegion(state)).toEqual([
        {
          type: 'portland',
          label: 'Portland',
          total: 10 + 25,
          contributions: [10, 25],
          count: 2,
        },
        {
          type: 'oregon',
          label: 'Oregon',
          total: 100 + 25 + 100 + 50,
          contributions: [25, 50, 100, 100],
          count: 4,
        },
        {
          type: 'out_of_state',
          label: 'Out Of State',
          total: 200 + 1000,
          contributions: [200, 1000],
          count: 2,
        },
      ]);
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        summaryPoint('eugene', 'or', 100),
        summaryPoint('gresham', 'or', 25),
        summaryPoint('wamic', 'or', 100),
        summaryPoint('culver', 'or', 50),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionsByRegion(state)).toEqual([
        {
          type: 'portland',
          label: 'Portland',
          total: 0,
          contributions: [],
          count: 0,
        },
        {
          type: 'oregon',
          label: 'Oregon',
          total: 100 + 25 + 100 + 50,
          contributions: [25, 50, 100, 100],
          count: 4,
        },
        {
          type: 'out_of_state',
          label: 'Out Of State',
          total: 0,
          contributions: [],
          count: 0,
        },
      ]);
    });
  });

  describe('campaignsTable', () => {
    const summaryPoint = (
      campaignId,
      campaignName,
      contributorName,
      amount,
      matchAmount,
      oaeType
    ) =>
      point({
        campaignId,
        campaignName,
        contributorName,
        amount,
        matchAmount,
        oaeType,
        officeSought: 'Mayor',
      });

    // public_matching_contribution

    const points = [
      summaryPoint('1', 'One', 'Abc', 5, 30, 'matchable'),
      summaryPoint('1', 'One', 'Def', 20, 120, 'matchable'),
      summaryPoint('1', 'One', 'Def', 100, 0, 'allowable'),
      summaryPoint('1', 'One', 'Ghi', 1000, null, 'allowable'),

      summaryPoint('2', 'Two', 'Def', 5, 30, 'matchable'),
      summaryPoint('2', 'Two', 'Ghi', 5, 30, 'matchable'),
      summaryPoint('2', 'Two', 'Ghi', 20, 120, 'matchable'),
      summaryPoint('2', 'Two', 'Jkl', 25, 150, 'matchable'),
      summaryPoint('2', 'Two', 'Jkl', 35, 210, 'matchable'),
      summaryPoint('2', 'Two', 'Mno', 100, 0, 'allowable'),
      summaryPoint(
        '2',
        'Two',
        'Mno',
        500,
        null,
        'public_matching_contribution'
      ),

      summaryPoint('3', 'Three', 'Abc', 50, 300, 'matchable'),
      summaryPoint('3', 'Three', 'Abc', 50, 300, 'matchable'),
      summaryPoint('3', 'Three', 'Abc', 78, 0, 'allowable'),
      summaryPoint('3', 'Three', 'Abc', 501, 30, 'allowable'),

      summaryPoint('4', 'Four', 'Def', 5, 30, 'matchable'),
      summaryPoint('4', 'Four', 'Ghi', 6, 36, 'matchable'),
      summaryPoint('4', 'Four', 'Jkl', 7, 42, 'matchable'),
    ];

    const [state] = makeData(points);

    expect(publicData.campaignsTable(state)).toEqual([
      {
        campaignId: '1',
        campaignName: 'One',
        officeSought: 'Mayor',
        donationsCount: 4,
        donorsCount: 3,
        totalAmountContributed: 5 + 20 + 100 + 1000,
        totalAmountMatched: 30 + 120,
        medianContributionSize: 60,
        micro: {
          total: 5 + 20,
          contributions: [5, 20],
        },
        small: {
          total: 100,
          contributions: [100],
        },
        medium: {
          total: 0,
          contributions: [],
        },
        large: {
          total: 1000,
          contributions: [1000],
        },
        mega: {
          total: 0,
          contributions: [],
        },
        contributions: points.slice(0, 4).map(p => p.properties),
      },
      {
        campaignId: '2',
        campaignName: 'Two',
        officeSought: 'Mayor',
        donationsCount: 6,
        donorsCount: 4,
        totalAmountContributed: 5 + 5 + 20 + 25 + 35 + 100,
        totalAmountMatched: 30 + 30 + 120 + 150 + 210,
        medianContributionSize: 22.5,
        micro: {
          total: 5 + 5 + 20 + 25,
          contributions: [5, 5, 20, 25],
        },
        small: {
          total: 35 + 100,
          contributions: [35, 100],
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
        contributions: points.slice(4, 10).map(p => p.properties),
      },
      {
        campaignId: '3',
        campaignName: 'Three',
        officeSought: 'Mayor',
        donationsCount: 4,
        donorsCount: 1,
        totalAmountContributed: 50 + 50 + 78 + 501,
        totalAmountMatched: 300 + 300 + 30,
        medianContributionSize: 64,
        micro: {
          total: 0,
          contributions: [],
        },
        small: {
          total: 50 + 50 + 78,
          contributions: [50, 50, 78],
        },
        medium: {
          total: 0,
          contributions: [],
        },
        large: {
          total: 501,
          contributions: [501],
        },
        mega: {
          total: 0,
          contributions: [],
        },
        contributions: points.slice(11, 15).map(p => p.properties),
      },
      {
        campaignId: '4',
        campaignName: 'Four',
        officeSought: 'Mayor',
        donationsCount: 3,
        donorsCount: 3,
        totalAmountContributed: 5 + 6 + 7,
        totalAmountMatched: 30 + 36 + 42,
        medianContributionSize: 6,
        micro: {
          total: 5 + 6 + 7,
          contributions: [5, 6, 7],
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
        contributions: points.slice(15).map(p => p.properties),
      },
    ]);
  });
});
