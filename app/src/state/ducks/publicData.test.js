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
      summaryPoint('Jkl', 5.23, 30, 'matchable'),
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
      const total = 10 + 20 + 30 + 100 + 5.23;
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
});
