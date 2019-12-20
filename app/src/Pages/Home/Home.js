import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import '@hackoregon/component-library/assets/global.styles.css';
import {
  ScatterPlotMap,
  BaseMap,
  MapTooltip,
} from '@hackoregon/component-library';
import PageHoc from '../../components/PageHoc/PageHoc';
import Table from '../../components/Table';
import ContributionTypePie from '../../components/Visualizations/ContributionTypePie';
import {
  getPublicData,
  publicDataRequest,
  allOffices,
  allCampaigns,
  selectedOffices,
  selectedCampaigns,
  filteredPublicData,
  campaignsTable,
  mapData,
  aggregatedContributorTypes,
  aggregatedContributionTypes,
  donationSizeByDonationRange,
  setSelectedOffices,
  setSelectedCampaigns,
} from '../../state/ducks/publicData';

const { dollars } = civicFormat;

class HomePage extends React.Component {
  componentDidMount() {
    const { fetchPublicData } = this.props;
    fetchPublicData();
  }

  render() {
    const {
      request,
      allOffices,
      allCampaigns,
      filteredData,
      contributorTypeData,
      contributionTypeData,
      contributionSizeData,
      selectedOffices,
      setSelectedOffices,
      selectedCampaigns,
      setSelectedCampaigns,
      campaignsTable,
      mapData,
    } = this.props;
    const { isLoading, error } = request;

    const bracketField = field => row =>
      `${dollars(row[field].total)} (${row[field].contributions.length})`;

    const columns = [
      {
        field: 'campaignName',
        title: 'Campaign',
        sorting: false,
      },
      {
        field: 'officeSought',
        title: 'Office',
        sorting: false,
      },
      {
        field: 'donationsCount',
        title: 'Total Contributions',
        sorting: false,
      },
      {
        field: 'totalAmountContributed',
        title: 'Total Amount',
        sorting: false,
        type: 'currency',
      },
      {
        field: 'totalAmountMatched',
        title: 'Total Matched',
        sorting: false,
        type: 'currency',
      },
      {
        title: 'Micro',
        sorting: false,
        render: bracketField('micro'),
      },
      {
        title: 'Small',
        sorting: false,
        render: bracketField('small'),
      },
      {
        title: 'Medium',
        sorting: false,
        render: bracketField('medium'),
      },
      {
        title: 'Large',
        sorting: false,
        render: bracketField('large'),
      },
      {
        title: 'Mega',
        sorting: false,
        render: bracketField('mega'),
      },
    ];

    const sanitize = features => features.filter(f => f.geometry.coordinates);

    const getPosition = f => f.geometry.coordinates;
    const getFillColor = () => [25, 183, 170, 255];

    return (
      <PageHoc>
        {error && <strong>Oh no! {error}</strong>}
        <FormControl>
          <InputLabel id="filter-offices">Offices</InputLabel>
          <Select
            multiple
            labelid="filter-offices"
            value={selectedOffices}
            onChange={event => setSelectedOffices(event.target.value)}
            input={<Input />}
          >
            {allOffices.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="filter-campaigns">Campaigns</InputLabel>
          <Select
            multiple
            labelid="filter-campaigns"
            value={selectedCampaigns}
            onChange={event => setSelectedCampaigns(event.target.value)}
            input={<Input />}
          >
            {allCampaigns.map(campaign => (
              <MenuItem key={campaign.id} value={campaign}>
                {campaign.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {mapData.features.length && (
          <BaseMap updateViewport={false} initialZoom={11}>
            <ScatterPlotMap
              data={sanitize(mapData.features)}
              getPosition={getPosition}
              opacity={0.1}
              getFillColor={getFillColor}
              radiusScale={5}
              getRadius={d => Math.sqrt(d.properties.amount)}
              autoHighlight
            >
              <MapTooltip
                primaryName="Campaign"
                primaryField="campaignName"
                secondaryName="Contribution"
                secondaryField="amount"
              />
            </ScatterPlotMap>
          </BaseMap>
        )}
        <h2>Campaigns</h2>
        <Table
          isLoading={isLoading}
          title="Campaigns"
          columns={columns}
          options={{
            pageSize: 50,
            showTitle: false,
          }}
          data={campaignsTable}
          perPage={50}
          pageNumber={0}
          totalRows={campaignsTable.length}
        />
        <ContributionTypePie data={contributorTypeData} />
        <ContributionTypePie data={contributionTypeData} />
      </PageHoc>
    );
  }
}

HomePage.propTypes = {
  fetchPublicData: PropTypes.func,
  request: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
  allOffices: PropTypes.arrayOf(PropTypes.string),
  allCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default connect(
  state => ({
    request: publicDataRequest(state),
    allOffices: allOffices(state),
    allCampaigns: allCampaigns(state),
    selectedOffices: selectedOffices(state),
    selectedCampaigns: selectedCampaigns(state),
    filteredData: filteredPublicData(state),
    campaignsTable: campaignsTable(state),
    mapData: mapData(state),
    contributorTypeData: aggregatedContributorTypes(state),
    contributionTypeData: aggregatedContributionTypes(state),
    contributionSizeData: donationSizeByDonationRange(state),
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
      setSelectedOffices: offices => dispatch(setSelectedOffices(offices)),
      setSelectedCampaigns: campaigns =>
        dispatch(setSelectedCampaigns(campaigns)),
    };
  }
)(HomePage);
