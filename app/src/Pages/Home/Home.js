/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import {
  ScatterPlotMap,
  ScreenGridMap,
  BaseMap,
  MapTooltip,
  MapLegend,
  VisualizationColors,
} from '@hackoregon/component-library';
import { scaleQuantize } from 'd3-scale';
import PageHoc from '../../components/PageHoc/PageHoc';
import Table from '../../components/Table';
import ContributionTypePie from '../../components/Visualizations/ContributionTypePie';
import {
  getPublicData,
  publicDataRequest,
  allOffices,
  availableCampaigns,
  selectedOffices,
  selectedCampaigns,
  selectedStartDate,
  selectedEndDate,
  filteredPublicData,
  campaignsTable,
  mapData,
  aggregatedContributorTypes,
  aggregatedDonationSize,
  aggregatedContributionsByRegion,
  donationSizeByDonationRange,
  setSelectedOffices,
  setSelectedCampaigns,
  setSelectedStartDate,
  setSelectedEndDate,
  summaryData,
} from '../../state/ducks/publicData';
import ContributionTypeBar from '../../components/Visualizations/ContributorTypeBar';
import { mediaQueryRanges } from '../../assets/styles/variables';
import ContributorLocationBar from '../../components/Visualizations/ContributorLocationBar';
import PublicDateRangeField from '../../components/Fields/PublicDateRangeField';

const { dollars } = civicFormat;
const scatterplotColor = { rgba: [35, 85, 44, 255], hex: '#23552c' };
const screenGridColorRange = VisualizationColors.sequential.ocean;

const formStyles = css`
  justify-content: flex-start;
  margin-left: 1rem;

  h1 {
    font-size: 1.5em;
  }

  .form-control {
    margin: 10px;
    min-width: 150px;
    vertical-align: baseline;
  }

  .MuiInputBase-root,
  .MuiFormLabel-root {
    font-size: 1.2rem;
    color: #000;
  }
`;

const footerStyle = css`
  text-align: center;
  font-style: italic;
  padding: 15px;
  font-size: 0.8em;
  color: #999;
`;

// The !importants are to override the Mui-* styles
// that are coming from the wrapping FormGroup.
// Ideally we wouldn't need them, but since the MenuItems
// are being teleported to a different place in the DOM,
// we can't beat the Mui-* styles with clever selector
// specificity.
const formOption = css`
  display: flex !important;
  justify-content: flex-start !important;
  padding: 10px !important;
`;

const visualizationContainer = css`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  @media ${mediaQueryRanges.mediumAndUp} {
    flex-direction: row;
    height: 700px;
  }
`;

const legendContainer = css`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.5rem;
`;

const legendStyle = css`
  font-family: 'Roboto Condensed', 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const legendMargin = css`
  margin: 10px 0 0 0;
`;

const chartContainer = css`
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const scatterplotFill = css`
  fill: ${scatterplotColor.hex};
`;

const mapHeight = css`
  height: 700px;
  width: 100%;
`;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: false };
  }

  componentDidMount() {
    const { fetchPublicData } = this.props;
    fetchPublicData();
  }

  render() {
    const {
      request,
      allOffices,
      availableCampaigns,
      aggregatedContributorTypes,
      aggregatedDonationSize,
      aggregatedContributionsByRegion,
      selectedOffices,
      selectedStartDate,
      selectedEndDate,
      setSelectedOffices,
      selectedCampaigns,
      setSelectedCampaigns,
      setDateRange,
      campaignsTable,
      mapData,
      summaryData,
    } = this.props;

    const { isLoading, error, timeLoaded } = request;

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

    const summaryColumns = [
      {
        field: 'donationsCount',
        title: 'Contributions',
        sorting: false,
      },
      {
        field: 'donorsCount',
        title: 'Donors',
        sorting: false,
      },
      {
        field: 'medianContributionSize',
        title: 'Median Contribution',
        sorting: false,
        type: 'currency',
      },
      {
        field: 'totalAmountContributed',
        title: 'Total Contributions',
        sorting: false,
        type: 'currency',
      },
      {
        field: 'totalAmountMatched',
        title: 'Total Matched',
        sorting: false,
        type: 'currency',
      },
    ];

    const sanitize = features => features.filter(f => f.geometry.coordinates);

    const getPosition = f => f.geometry.coordinates;
    const getFillColor = () => scatterplotColor.rgba;
    const colorScale = scaleQuantize()
      .domain([0, 1])
      .range(screenGridColorRange);

    return (
      <PageHoc>
        {error && <strong>Oh no! {error}</strong>}
        <FormGroup row css={formStyles}>
          <h1>
            Contributions for
            <FormControl className="form-control">
              <InputLabel id="filter-offices">
                {`${selectedOffices.length ? '' : 'all '}`}offices
              </InputLabel>
              <Select
                multiple
                labelid="filter-offices"
                value={selectedOffices}
                onChange={event => setSelectedOffices(event.target.value)}
                input={<Input />}
              >
                {allOffices.map(name => (
                  <MenuItem key={name} value={name} css={formOption}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            ,
            <FormControl className="form-control">
              <InputLabel id="filter-campaigns">
                {`${selectedCampaigns.length ? '' : 'all '}`}campaigns
              </InputLabel>
              <Select
                multiple
                labelid="filter-campaigns"
                value={selectedCampaigns}
                onChange={event => setSelectedCampaigns(event.target.value)}
                input={<Input />}
              >
                {availableCampaigns.map(campaign => (
                  <MenuItem key={campaign.id} value={campaign} css={formOption}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="form-control">
              <PublicDateRangeField
                id="filter-date"
                from={selectedStartDate}
                to={selectedEndDate}
                onChange={setDateRange}
              />
            </FormControl>
            by
            <FormControl className="form-control">
              <Select
                value={this.state.count ? 'Count' : 'Amount'}
                onChange={event =>
                  this.setState({ count: event.target.value === 'Count' })
                }
              >
                <MenuItem value="Amount" css={formOption}>
                  amount
                </MenuItem>
                <MenuItem value="Count" css={formOption}>
                  count
                </MenuItem>
              </Select>
            </FormControl>
          </h1>
        </FormGroup>
        {!!summaryData && (
          <Table
            isLoading={isLoading}
            title="Campaigns"
            columns={summaryColumns}
            options={{
              pageSize: 1,
              showTitle: false,
              paging: false,
            }}
            data={[summaryData]}
            perPage={1}
            pageNumber={0}
            totalRows={1}
            components={{ Toolbar: () => <div /> }}
          />
        )}
        <div css={visualizationContainer}>
          {!!mapData.features.length && (
            <>
              <div css={mapHeight}>
                <div css={legendContainer}>
                  {this.state.count && (
                    <legend css={legendStyle}>
                      <MapLegend
                        colorScale={colorScale}
                        formatValues={f =>
                          f === 0 ? `Fewer Contributions` : `More Contributions`
                        }
                        label=""
                        vertical={false}
                      />
                    </legend>
                  )}
                  {!this.state.count && (
                    <legend css={[legendStyle, legendMargin]}>
                      <span
                        css={css`
                          margin-left: 5px;
                        `}
                      >
                        Smaller Contributions
                      </span>
                      <span
                        css={css`
                          margin-left: 5px;
                        `}
                      >
                        <svg viewBox="0 0 50 10" width="50px">
                          <circle cx="5" cy="5" r="1" css={scatterplotFill} />
                          <circle cx="15" cy="5" r="2" css={scatterplotFill} />
                          <circle cx="25" cy="5" r="3" css={scatterplotFill} />
                          <circle cx="35" cy="5" r="4" css={scatterplotFill} />
                          <circle cx="45" cy="5" r="5" css={scatterplotFill} />
                        </svg>
                        <span
                          css={css`
                            margin-left: 5px;
                          `}
                        >
                          Larger Contributions
                        </span>
                      </span>
                    </legend>
                  )}
                </div>
                <BaseMap
                  updateViewport={false}
                  initialZoom={11}
                  useContainerHeight
                >
                  {!this.state.count ? (
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
                  ) : (
                    <div />
                  )}
                  {this.state.count ? (
                    <ScreenGridMap
                      data={sanitize(mapData.features)}
                      getPosition={getPosition}
                      opacity={1}
                      colorRange={screenGridColorRange}
                      cellSizePixels={15}
                    >
                      <MapTooltip
                        tooltipDataArray={[
                          {
                            name: `Number of contributions`,
                            field: 'cellCount',
                            formatField: civicFormat.numeric,
                          },
                        ]}
                        isScreenGrid
                        wide
                      />
                    </ScreenGridMap>
                  ) : (
                    <div />
                  )}
                </BaseMap>
              </div>
              <div css={chartContainer}>
                <ContributionTypeBar
                  data={aggregatedContributorTypes}
                  count={this.state.count}
                />
                <ContributionTypePie
                  data={aggregatedDonationSize}
                  count={this.state.count}
                />
                <ContributorLocationBar
                  data={aggregatedContributionsByRegion}
                  count={this.state.count}
                />
              </div>
            </>
          )}
        </div>
        {!!campaignsTable.length && (
          <>
            <h2
              css={css`
                margin-left: 1rem;
                padding-top: 2rem;
                font-size: 1.5rem;
              `}
            >
              Campaigns
            </h2>
            <Table
              isLoading={isLoading}
              title="Campaigns"
              columns={columns}
              options={{
                pageSize: Math.min(campaignsTable.length, 25),
                showTitle: false,
                paging: false,
              }}
              data={campaignsTable}
              perPage={Math.min(campaignsTable.length, 25)}
              pageNumber={0}
              totalRows={campaignsTable.length}
              components={{ Toolbar: () => <div /> }}
            />
          </>
        )}
        {!!timeLoaded && (
          <footer css={footerStyle}>
            Data from Open and Accountable Elections retrieved on{' '}
            {format(timeLoaded, 'MMM DD, YYYY [a]t h:mm:ssa')}
          </footer>
        )}
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
    availableCampaigns: availableCampaigns(state),
    selectedOffices: selectedOffices(state),
    selectedCampaigns: selectedCampaigns(state),
    selectedStartDate: selectedStartDate(state),
    selectedEndDate: selectedEndDate(state),
    filteredData: filteredPublicData(state),
    campaignsTable: campaignsTable(state),
    mapData: mapData(state),
    aggregatedContributorTypes: aggregatedContributorTypes(state),
    aggregatedDonationSize: aggregatedDonationSize(state),
    aggregatedContributionsByRegion: aggregatedContributionsByRegion(state),
    donationSizeByDonationRange: donationSizeByDonationRange(state),
    summaryData: summaryData(state),
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
      setSelectedOffices: offices => dispatch(setSelectedOffices(offices)),
      setSelectedCampaigns: campaigns =>
        dispatch(setSelectedCampaigns(campaigns)),
      setDateRange: (from, to) => {
        dispatch(setSelectedStartDate(from));
        dispatch(setSelectedEndDate(to));
      },
    };
  }
)(HomePage);
