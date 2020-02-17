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
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import {
  ScatterPlotMap,
  ScreenGridMap,
  BaseMap,
  MapTooltip,
  MapLegend,
  VisualizationColors,
  Logo,
  Collapsable,
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: max-content;
  margin: 0 auto 1em auto;
  padding: 0 1em;
  border: 1px solid rgb(224, 224, 224);
  background-color: rgba(243, 242, 243, 0.4);

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

const dataLoadedStyle = css`
  font-style: italic;
  font-size: 0.7em;
  color: rgba(0, 0, 0, 0.54);
  text-align: center;
`;

const contentStyle = css`
  padding: 12px;
  max-width: 700px;
  margin: 12px auto;
  button {
    color: #5e63f6;
  }
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
  @media ${mediaQueryRanges.mediumAndUp} {
    height: 700px;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 2.5em 0.5em 0em 0.5em;
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
      },
      {
        field: 'officeSought',
        title: 'Office',
      },
      {
        field: 'donationsCount',
        title: 'Contributions',
        defaultSort: 'desc',
      },
      {
        field: 'totalAmountContributed',
        title: 'Total Contributions',
        type: 'currency',
      },
      {
        field: 'totalAmountMatched',
        title: 'Total Match Approved',
        type: 'currency',
      },
      {
        title: 'Micro',
        render: bracketField('micro'),
        sorting: false,
      },
      {
        title: 'Small',
        render: bracketField('small'),
        sorting: false,
      },
      {
        title: 'Medium',
        render: bracketField('medium'),
        sorting: false,
      },
      {
        title: 'Large',
        render: bracketField('large'),
        sorting: false,
      },
      {
        title: 'Mega',
        render: bracketField('mega'),
        sorting: false,
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
        title: 'Total Match Approved',
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
        <section css={contentStyle}>
          <p>
            <a href="https://portlandoregon.gov/oae">
              Open and Accountable Elections
            </a>{' '}
            is the City of Portland's small donor matching program. It is
            designed to ensure that the City government is accountable to all
            Portlanders, not just big campaign donors.
          </p>
          <p>
            The program is open to candidates for Mayor, Commissioner, and
            Auditor. To participate, they must show broad community support and
            accept contribution limits. The program provides a 6-to-1 match from
            the City’s Open & Accountable Elections Fund for the first $50 from
            any Portland donor.
          </p>
          <p>
            The real-time dashboard below shows contribution sources for
            participating candidates.
          </p>
          <Collapsable description="Open and Accountable Elections">
            <Collapsable.Section hidden>
              <h2>How it works</h2>
              <p>
                <i>
                  This is a summary. See the{' '}
                  <a href="https://www.portlandoregon.gov/oae/">
                    program website
                  </a>{' '}
                  for full details.
                </i>
              </p>
              <ul>
                <li>Candidates may opt into the program.</li>
                <li>
                  To qualify, they must show that they have{' '}
                  <u>broad community support</u> by collecting 250 small
                  contributions from Portlanders if running for Council or
                  Auditor or 500 small contributions if running for Mayor.
                </li>
                <li>
                  Participating candidates must agree to contribution limits.
                  They must{' '}
                  <u>
                    agree to collect no more than $250 per donor and only from
                    humans, not businesses or political committees
                  </u>
                  , with two exceptions:
                  <ul>
                    <li>
                      The first exception is that candidates may raise as much
                      as $5,000 in “seed money” in order to raise their 250 or
                      500 qualifying contributions. This helps them hire a
                      treasurer and campaign manager or print materials and
                      build a website to collect small contributions. This money
                      can come from a past campaign, themselves as a gift or a
                      loan, or from donors.
                    </li>
                    <li>
                      The second exception is $20,000 of in-kind contributions.
                      This enables candidates to get <i>non-monetary</i> support
                      – like throwing house parties or creating art for their
                      campaign – from supporters, up to a total campaign limit
                      of $20,000.
                    </li>
                  </ul>
                </li>
                <li>
                  As candidates collect small contributions from Portlanders,
                  the City matches them 6-to-1 on the first $50. So if you give
                  a candidate $10 a month, the City will match that with $60
                  each time until you’ve given $50 and the City has provided the
                  candidate $300 in matching funds for you.
                </li>
                <li>
                  You can get matched for each race, so you could give to
                  someone running for Mayor and get matched, and to candidates
                  in each of the Commission races and get matched, and to a
                  candidate in the Auditor’s race and get matched.
                </li>
              </ul>
              <h2>What it's for</h2>
              <p>
                Our government works best when every person is engaged in the
                elections process and can make a difference in the community.
                The program fosters an inclusive democratic process where
                everyone participates and everyone’s contributions matter. A
                community where people from all walks of life can run for and
                win office, while avoiding concerns about the influence of large
                donations in City elections.
              </p>
              <p>
                We’re strongest when our elected city leaders reflect the full
                range of talent and lived experience that Portland has to offer,
                and when the community trusts that elected leaders share the
                community’s values. People from every neighborhood in Portland
                should have meaningful opportunities to influence who is elected
                to City offices, and to run effective citywide campaigns.
              </p>

              <h2>About the software</h2>
              <p>
                This dashboard and the software the powers it was built in
                partnership between the City’s Open and Accountable Elections
                program and the{' '}
                <a href="https://civicsoftwarefoundation.org">
                  Civic Software Foundation
                </a>
                .
              </p>

              <p>
                The software is{' '}
                <a href="https://github.com/hackoregon/openelections/">
                  open-source
                </a>{' '}
                which means that anyone can scrutinize the code — which is
                essential for true transparency and accountability. It also
                means that other governments interested in visualizing their
                campaign finance data can use some or all of the open-source
                code.
              </p>

              <p>
                The software was built by an interdisciplinary team of
                volunteers and contractors working together through{' '}
                <a href="https://hackoregon.org">Hack Oregon</a>.
              </p>

              <h2>Coming soon</h2>
              <ul>
                <li>Information on non-participating candidates</li>
                <li>
                  Further integration with the{' '}
                  <a href="civicplatform.org">CIVIC Platform</a> to facilitate
                  public use and sharing of data visualizations
                </li>
                <li>
                  Documentation of the collaborative software development
                  process
                </li>
              </ul>
            </Collapsable.Section>
          </Collapsable>
        </section>
        <FormGroup row css={formStyles}>
          <h1>
            Contributions for
            <FormControl className="form-control">
              <InputLabel id="filter-offices-label">
                {`${selectedOffices.length ? '' : 'all '}`}offices
              </InputLabel>
              <Select
                multiple
                labelid="filter-offices"
                value={selectedOffices}
                onChange={event => setSelectedOffices(event.target.value)}
                input={<Input />}
                renderValue={selected => selected.join(', ')}
              >
                {allOffices.map(name => (
                  <MenuItem key={name} value={name} css={formOption}>
                    <Checkbox checked={selectedOffices.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Limit by position</FormHelperText>
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
                renderValue={selected =>
                  selected.map(campaign => campaign.name).join(', ')
                }
              >
                {availableCampaigns.map(campaign => (
                  <MenuItem key={campaign.id} value={campaign} css={formOption}>
                    <Checkbox
                      checked={selectedCampaigns.indexOf(campaign) > -1}
                    />
                    <ListItemText primary={campaign.name} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Limit by candidate</FormHelperText>
            </FormControl>
            <FormControl className="form-control">
              <PublicDateRangeField
                id="filter-date"
                from={selectedStartDate}
                to={selectedEndDate}
                onChange={setDateRange}
              />
              <FormHelperText>Limit by date range</FormHelperText>
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
              <FormHelperText>View by amount or count</FormHelperText>
            </FormControl>
          </h1>
          {!isLoading && (
            <div css={dataLoadedStyle}>
              Live data from Open and Accountable Elections retrieved on{' '}
              {format(timeLoaded, 'MMM DD, YYYY [a]t h:mm:ssa')}.
              Non-participating candidates not shown.
            </div>
          )}
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
                sorting: true,
              }}
              data={campaignsTable}
              perPage={Math.min(campaignsTable.length, 25)}
              pageNumber={0}
              totalRows={campaignsTable.length}
              components={{ Toolbar: () => <div /> }}
            />
          </>
        )}
        <section css={contentStyle}>
          <h2>About this data</h2>
          <p>
            This data is pulled live from the Open and Accountable Elections
            database. Campaigns submit their contributions through the Open and
            Accountable Elections application, and submitted contributions will
            immediately display in the dashboard.
          </p>
          <p>
            The information above includes both monetary and non-monetary
            (in-kind) contributions. In-kind contributions are limited to
            $20,000 by program rules.
          </p>
          <p>
            The match information is based on what has been approved for
            matching, not what has actually been paid. Matching contributions
            from the Open & Accountable Elections Fund are not shown on the map.
          </p>
        </section>
        <footer
          css={css`
            text-align: center;
            margin: 2em auto;
          `}
        >
          <div>Built with and for the public by:</div>
          <div
            css={css`
              margin: 1em auto;
            `}
          >
            <a
              href="https://www.civicsoftwarefoundation.org"
              css={css`
                margin: 1em;
              `}
            >
              <Logo type="standardLogo" alt="CIVIC Logo" />
            </a>
            <a
              href="https://www.hackoregon.org"
              css={css`
                margin: 1em;
              `}
            >
              <Logo type="hackOregon" alt="Hack Oregon Logo" />
            </a>
          </div>
        </footer>
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
