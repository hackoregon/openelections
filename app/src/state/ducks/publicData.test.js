import * as publicData from './publicData';

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

describe.only('Selectors', () => {
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
        { campaignId: '1', campaignName: 'Foo' },
        { campaignId: '2', campaignName: 'Bar' },
        { campaignId: '3', campaignName: 'Baz' },
      ];
      const [state] = makeData(campaigns.map(point));

      expect(publicData.allCampaigns(state)).toEqual(
        campaigns.map(c => ({
          id: c.campaignId,
          name: c.campaignName,
        }))
      );
    });

    it('does not return duplicate values (based on ID, last name wins)', () => {
      const campaigns = [
        { campaignId: '1', campaignName: 'Foo 1' },
        { campaignId: '1', campaignName: 'Foo 2' },
        { campaignId: '2', campaignName: 'Bar 1' },
        { campaignId: '2', campaignName: 'Bar 2' },
        { campaignId: '3', campaignName: 'Foo 1' },
        { campaignId: '3', campaignName: 'Foo 2' },
      ];
      const [state] = makeData(campaigns.map(point));

      expect(publicData.allCampaigns(state)).toEqual([
        { id: '1', name: 'Foo 2' },
        { id: '2', name: 'Bar 2' },
        { id: '3', name: 'Foo 2' },
      ]);
    });

    it('returns an empty array when there is no data', () => {
      const [state] = makeData();

      expect(publicData.allCampaigns(state)).toEqual([]);
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
      expect(publicData.selectedCampaigns(state)).toEqual(['1', '2', '3']);
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

    it('returns the total number of donations', () => {
      expect(publicData.summaryData(state).donationsCount).toEqual(
        points.length
      );
    });

    it('returns the total number of donors (uniqued by contributor name)', () => {
      expect(publicData.summaryData(state).donorsCount).toEqual(4);
    });

    it('returns the total amount contributed and the total amount matched', () => {
      const total = 10 + 20 + 30 + 100 + 5;
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
          total: 30 + 50,
          contributions: [30, 50],
        },
        medium: {
          total: 100 + 150 + 200,
          contributions: [100, 150, 200],
        },
        large: {
          total: 500 + 750,
          contributions: [500, 750],
        },
        mega: {
          total: 1000 + 2500,
          contributions: [1000, 2500],
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
          total: 0,
          contributions: [],
        },
        mega: {
          total: 1000 + 2500,
          contributions: [1000, 2500],
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

      expect(publicData.aggregatedContributorTypes(state)).toEqual({
        individual: {
          total: 10 + 15,
          contributions: [10, 15],
        },
        business: {
          total: 100 + 1450 + 890,
          contributions: [100, 890, 1450],
        },
        family: {
          total: 50,
          contributions: [50],
        },
        labor: {
          total: 500,
          contributions: [500],
        },
        political_committee: {
          total: 30,
          contributions: [30],
        },
        political_party: {
          total: 100,
          contributions: [100],
        },
        unregistered: {
          total: 150,
          contributions: [150],
        },
        other: {
          total: 9 + 10,
          contributions: [9, 10],
        },
      });
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

      expect(publicData.aggregatedContributorTypes(state)).toEqual({
        individual: {
          total: 10 + 15,
          contributions: [10, 15],
        },
        business: {
          total: 100 + 1450 + 890,
          contributions: [100, 890, 1450],
        },
        family: {
          total: 0,
          contributions: [],
        },
        labor: {
          total: 0,
          contributions: [],
        },
        political_committee: {
          total: 0,
          contributions: [],
        },
        political_party: {
          total: 0,
          contributions: [],
        },
        unregistered: {
          total: 150,
          contributions: [150],
        },
        other: {
          total: 0,
          contributions: [],
        },
      });
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

      expect(publicData.aggregatedContributionTypes(state)).toEqual({
        cash: {
          total: 10 + 14,
          contributions: [10, 14],
        },
        inkind: {
          total: 40 + 95 + 100 + 139,
          contributions: [40, 95, 100, 139],
        },
        other: {
          total: 10 + 25 + 5,
          contributions: [5, 10, 25],
        },
      });
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        summaryPoint('inkind_onefish', 40),
        summaryPoint('inkind_2_fish', 95),
        summaryPoint('inkind_redfish', 100),
        summaryPoint('inkind_bluefish', 139),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionTypes(state)).toEqual({
        cash: {
          total: 0,
          contributions: [],
        },
        inkind: {
          total: 40 + 95 + 100 + 139,
          contributions: [40, 95, 100, 139],
        },
        other: {
          total: 0,
          contributions: [],
        },
      });
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

      expect(publicData.aggregatedContributionsByRegion(state)).toEqual({
        portland: {
          total: 10 + 25,
          contributions: [10, 25],
        },
        oregon: {
          total: 100 + 25 + 100 + 50,
          contributions: [25, 50, 100, 100],
        },
        outside: {
          total: 200 + 1000,
          contributions: [200, 1000],
        },
      });
    });

    it('reports 0 for any empty buckets', () => {
      const points = [
        summaryPoint('eugene', 'or', 100),
        summaryPoint('gresham', 'or', 25),
        summaryPoint('wamic', 'or', 100),
        summaryPoint('culver', 'or', 50),
      ];

      const [state] = makeData(points);

      expect(publicData.aggregatedContributionsByRegion(state)).toEqual({
        portland: {
          total: 0,
          contributions: [],
        },
        oregon: {
          total: 100 + 25 + 100 + 50,
          contributions: [25, 50, 100, 100],
        },
        outside: {
          total: 0,
          contributions: [],
        },
      });
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
      summaryPoint('3', 'Three', 'Abc', 500, 30, 'allowable'),

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
          total: 0,
          contributions: [],
        },
        medium: {
          total: 100,
          contributions: [100],
        },
        large: {
          total: 0,
          contributions: [],
        },
        mega: {
          total: 1000,
          contributions: [1000],
        },
        contributions: points.slice(0, 4).map(p => p.properties),
      },
      {
        campaignId: '2',
        campaignName: 'Two',
        officeSought: 'Mayor',
        donationsCount: 7,
        donorsCount: 4,
        totalAmountContributed: 5 + 5 + 20 + 25 + 35 + 100 + 500,
        totalAmountMatched: 30 + 30 + 120 + 150 + 210,
        medianContributionSize: 22.5,
        micro: {
          total: 5 + 5 + 20,
          contributions: [5, 5, 20],
        },
        small: {
          total: 25 + 35,
          contributions: [25, 35],
        },
        medium: {
          total: 100,
          contributions: [100],
        },
        large: {
          total: 500,
          contributions: [500],
        },
        mega: {
          total: 0,
          contributions: [],
        },
        contributions: points.slice(4, 11).map(p => p.properties),
      },
      {
        campaignId: '3',
        campaignName: 'Three',
        officeSought: 'Mayor',
        donationsCount: 4,
        donorsCount: 1,
        totalAmountContributed: 50 + 50 + 78 + 500,
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
          total: 500,
          contributions: [500],
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
