/** @jsx jsx */
import { css, jsx, cx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import React, { useEffect } from 'react';
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
import { Clear } from '@material-ui/icons';
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
import { useCookies } from 'react-cookie';

import PageHoc from '../../components/PageHoc/PageHoc';
import Table from '../../components/Table';
import Button from '../../components/Button/Button';
import ContributionTypePie from '../../components/Visualizations/ContributionTypePie';
import ContributionTypeBar from '../../components/Visualizations/ContributorTypeBar';
import { mediaQueryRanges } from '../../assets/styles/variables';
import ContributorLocationBar from '../../components/Visualizations/ContributorLocationBar';
import PublicDateRangeField from '../../components/Fields/PublicDateRangeField';
import Modal from '../../components/Modal/index';
import MadeByFooter from './MadeByFooter';

const { dollars } = civicFormat;
const scatterplotColor = { rgba: [36, 184, 26, 255], hex: '#24b81a' };
const alternateScatterplotColor = { rgba: [230, 0, 26, 255], hex: '#e6001a' };
const screenGridColorRange = VisualizationColors.sequential.ocean;

const filterWrapper = css`
  top: 0;
  z-index: 9999;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
  justify-items: start;
  margin: 0 auto;
  padding: 1em 1em;
  border: 1px solid rgb(224, 224, 224);
  background-color: #f9f9f9;
  @media ${mediaQueryRanges.mediumAndUp} {
    padding: 0 1em;
    position: sticky;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    align-items: center;
    justify-items: end;
  }
`;

const formStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;

  h1 {
    font-size: 1.5em;
  }

  .form-control {
    margin: 10px;
    min-width: 150px;
    vertical-align: baseline;
  }

  .MuiInputBase-input {
    padding-left: 6px;
  }

  .MuiInputBase-root {
    background: #d3d3d3;
  }

  .MuiInputBase-root,
  .MuiFormLabel-root {
    font-size: 1.2rem;
    color: #000;
  }
`;

const formText = css`
  font-size: 0.9em;
  vertical-align: baseline;
  line-height: 1;
`;

const dataLoadedStyle = css`
  font-style: italic;
  font-size: 0.7em;
  color: rgba(0, 0, 0, 0.54);
  padding: 0 1em;
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

const compareVisualizationContainer = rows => css`
  margin: 2rem 0;
  display: grid;
  grid-template-rows: repeat(4, auto);
  grid-template-columns: repeat(${rows}, auto);
  @media ${mediaQueryRanges.mediumAndUp} {
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

const center = css`
  margin: 0 auto;
`;

const table = css`
  margin: 1em auto 2em auto;
  border-spacing: 1em 0.25em;
  th {
    text-align: left;
  }
`;

const scatterplotFill = css`
  fill: ${scatterplotColor.hex};
`;

const alternateScatterplotFill = css`
  fill: ${alternateScatterplotColor.hex};
`;

const mapHeight = css`
  height: 700px;
  width: 100%;
`;

const buttonStyles = css`
  margin: 0 5px !important;
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1em;
  @media screen and (max-width: 600px) {
    align-content: center;
  }
`;

const modalStyle = css`
  position: absolute;
  max-width: max-content;
  margin: 0 auto;
  background: white;
  top: 8vh;
  bottom: 8vh;
  left: 0;
  right: 0;
  overflow: auto;
`;

const introModalStyle = css`
  position: absolute;
  max-width: max-content;
  margin: 0 auto;
  background: white;
  top: 8vh;
  left: 0;
  right: 0;
`;

const Home = ({
  request,
  externalRequest,
  allOffices,
  availableCampaigns,
  availableCampaignNames,
  aggregatedContributorTypes,
  aggregatedDonationSize,
  aggregatedContributionsByRegion,
  aggregatedContributorTypesByCandidate,
  aggregatedDonationSizeByCandidate,
  aggregatedContributionsByRegionByCandidate,
  selectedFinancing,
  selectedOffices,
  selectedStartDate,
  selectedEndDate,
  setSelectedOffices,
  setSelectedFinancing,
  selectedCampaigns,
  selectedCampaignNames,
  setSelectedCampaigns,
  setDateRange,
  selectedCount,
  setSelectedCount,
  selectedCompare,
  setSelectedCompare,
  campaignsTable,
  mapData,
  summaryData,
  summaryDataByParticipation,
  showModal,
  resetAll,
  setCustomFilters,
}) => {
  const [cookies, setCookie] = useCookies('visited');

  useEffect(() => {
    cookies.visited ||
      showModal({
        component: 'Info',
        props: {},
      });
  }, [showModal, cookies.visited]);

  const isPublicLoading = request ? request.isLoading : true;
  const isExternalLoading = externalRequest
    ? externalRequest.isExternalLoading
    : true;
  const isLoading = !(!isPublicLoading && !isExternalLoading);
  const error = request && request.error;
  const timeLoaded = request && request.timeLoaded;
  const externalError = externalRequest && externalRequest.externalError;

  const bracketField = field => row =>
    `${dollars(row[field].total)} (${row[field].contributions.length})`;

  const columns = [
    {
      field: 'participatingStatus',
      title: 'Public Financing',
    },
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
      title: 'Micro: <$25',
      render: bracketField('micro'),
      sorting: false,
    },
    {
      title: 'Small: $25-$100',
      render: bracketField('small'),
      sorting: false,
    },
    {
      title: 'Medium: $100-250',
      render: bracketField('medium'),
      sorting: false,
    },
    {
      title: 'Large: $250-$1,000',
      render: bracketField('large'),
      sorting: false,
    },
    {
      title: 'Mega: >$1,000',
      render: bracketField('mega'),
      sorting: false,
    },
  ];

  const summaryColumns = [
    {
      field: 'participatingStatus',
      title: 'Public Financing',
      sorting: false,
    },
    {
      field: 'campaignsCount',
      title: 'Campaigns',
      sorting: false,
    },
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
  const getFillColor = f =>
    f.properties.campaignName === 'Ted Wheeler'
      ? alternateScatterplotColor.rgba
      : scatterplotColor.rgba;
  const colorScale = scaleQuantize()
    .domain([0, 1])
    .range(screenGridColorRange);

  return (
    <PageHoc>
      {error && <strong>Oh no! {error}</strong>}
      {externalError && <strong>Oh no! {externalError}</strong>}
      <div css={filterWrapper}>
        <FormGroup row css={formStyles}>
          <h1>
            <span css={formText}>Campaign contributions for </span>
            <FormControl className="form-control">
              <InputLabel id="filter-offices-label">
                {`${
                  selectedOffices && selectedOffices.length ? '' : 'all offices'
                }`}
              </InputLabel>
              <Select
                multiple
                displayEmpty
                labelid="filter-offices"
                value={selectedOffices}
                onChange={event => {
                  const selected = event.target.value;
                  const selectedCampaignsMatchingOffices =
                    selected.length === 0
                      ? selectedCampaigns
                      : selectedCampaigns.filter(campaign =>
                          selected.includes(campaign.officeSought)
                        );
                  setSelectedOffices(selected);
                  setSelectedCampaigns(selectedCampaignsMatchingOffices);
                }}
                input={<Input />}
                renderValue={selected =>
                  selected && selected.length > 0
                    ? selected.map(office => office).join(', ')
                    : 'all offices'
                }
              >
                {allOffices.map(name => (
                  <MenuItem key={name} value={name} css={formOption}>
                    <Checkbox
                      color="primary"
                      checked={
                        selectedOffices && selectedOffices.indexOf(name) > -1
                      }
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Limit by office</FormHelperText>
            </FormControl>
            <span css={formText}>,</span>
            <FormControl className="form-control">
              <InputLabel id="filter-campaigns">
                {`${
                  selectedCampaignNames && selectedCampaignNames.length
                    ? ''
                    : 'all '
                }`}
                candidates
              </InputLabel>
              <Select
                multiple
                displayEmpty
                labelid="filter-campaigns"
                value={selectedCampaignNames}
                onChange={event =>
                  setSelectedCampaigns(
                    event.target.value.map(name =>
                      availableCampaigns.find(
                        campaign => campaign.name === name
                      )
                    )
                  )
                }
                input={<Input />}
                renderValue={selected =>
                  selected && selected.length > 0
                    ? selected.map(campaign => campaign).join(', ')
                    : 'all candidates'
                }
              >
                {availableCampaignNames.map(campaign => (
                  <MenuItem key={campaign} value={campaign} css={formOption}>
                    <Checkbox
                      color="primary"
                      checked={
                        selectedCampaignNames &&
                        selectedCampaignNames.indexOf(campaign) > -1
                      }
                    />
                    <ListItemText primary={campaign} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Limit by candidate</FormHelperText>
            </FormControl>
            <span css={formText}>using</span>
            <FormControl className="form-control">
              <Select
                value={selectedFinancing}
                onChange={event => setSelectedFinancing(event.target.value)}
              >
                <MenuItem value="public" css={formOption}>
                  public financing
                </MenuItem>
                <MenuItem value="not public" css={formOption}>
                  private financing
                </MenuItem>
                <MenuItem value="all" css={formOption}>
                  any financing
                </MenuItem>
              </Select>
              <FormHelperText>Open and Accountable Elections</FormHelperText>
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
            <span css={formText}>by</span>
            <FormControl className="form-control">
              <Select
                value={selectedCount ? 'Count' : 'Amount'}
                onChange={event =>
                  setSelectedCount(event.target.value === 'Count')
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
            {/* <FormControl className="form-control">
              <div css={buttonStyles}>
                <Button css={buttonStyles} onClick={() => resetAll()}>
                  <Clear />
                </Button>
              </div>
              <FormHelperText>Clear all</FormHelperText>
            </FormControl> */}
          </h1>
          <div css={buttonWrapper}>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    financing: 'all',
                  })
                }
              >
                All
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() => {
                  const monthAgo = new Date(timeLoaded);
                  monthAgo.setMonth(timeLoaded.getMonth() - 1);
                  setCustomFilters({
                    financing: 'all',
                    startDate: monthAgo,
                    endDate: timeLoaded,
                  });
                }}
              >
                Last Month
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    financing: 'all',
                    campaigns: availableCampaigns.filter(
                      campaign =>
                        campaign.name === 'Sarah Iannarone' ||
                        campaign.name === 'Ted Wheeler'
                    ),
                    compare: true,
                  })
                }
              >
                Runoff: Mayor
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    financing: 'all',
                    campaigns: availableCampaigns.filter(
                      campaign =>
                        campaign.name === 'Chloe Eudaly' ||
                        campaign.name === 'Mingus Mapps'
                    ),
                    compare: true,
                  })
                }
              >
                Runoff: Commissioner 4
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Sarah Iannarone'
                      ),
                    ],
                  })
                }
              >
                Sarah Iannarone
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Ted Wheeler'
                      ),
                    ],
                    financing: 'all',
                  })
                }
              >
                Ted Wheeler
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Chloe Eudaly'
                      ),
                    ],
                  })
                }
              >
                Chloe Eudaly
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                css={buttonStyles}
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Mingus Mapps'
                      ),
                    ],
                  })
                }
              >
                Mingus Mapps
              </Button>
            </div>
          </div>
          {!isLoading && (
            <div css={dataLoadedStyle}>
              Live data from Open and Accountable Elections retrieved on{' '}
              {format(timeLoaded, 'MMM DD, YYYY [a]t h:mm:ssa')}. Data loaded
              from ORESTAR for non-participating candidates on MMM DD, YYYY at
              h:mm:ssa
            </div>
          )}
        </FormGroup>
      </div>
      {!!summaryDataByParticipation && !selectedCompare && (
        <Table
          isLoading={isLoading}
          title="Campaigns"
          columns={summaryColumns}
          options={{
            pageSize: 2,
            showTitle: false,
            paging: false,
          }}
          data={summaryDataByParticipation}
          perPage={2}
          pageNumber={0}
          totalRows={2}
          // eslint-disable-next-line react/display-name
          components={{ Toolbar: () => <div /> }}
        />
      )}
      {!selectedCompare && (
        <div css={visualizationContainer}>
          {!!mapData.features.length && (
            <>
              <div css={mapHeight}>
                <div css={legendContainer}>
                  {selectedCount && (
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
                  {!selectedCount && (
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
                          <circle
                            cx="5"
                            cy="5"
                            r="1"
                            css={
                              selectedFinancing !== 'not public'
                                ? scatterplotFill
                                : alternateScatterplotFill
                            }
                          />
                          <circle
                            cx="15"
                            cy="5"
                            r="2"
                            css={
                              selectedFinancing !== 'not public'
                                ? scatterplotFill
                                : alternateScatterplotFill
                            }
                          />
                          <circle
                            cx="25"
                            cy="5"
                            r="3"
                            css={
                              selectedFinancing !== 'not public'
                                ? scatterplotFill
                                : alternateScatterplotFill
                            }
                          />
                          <circle
                            cx="35"
                            cy="5"
                            r="4"
                            css={
                              selectedFinancing !== 'not public'
                                ? scatterplotFill
                                : alternateScatterplotFill
                            }
                          />
                          <circle
                            cx="45"
                            cy="5"
                            r="5"
                            css={
                              selectedFinancing !== 'not public'
                                ? scatterplotFill
                                : alternateScatterplotFill
                            }
                          />
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
                  {!selectedCount ? (
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
                        tooltipDataArray={[
                          {
                            name: `Campaign`,
                            field: 'campaignName',
                            formatField: civicFormat.titleCase,
                          },
                          {
                            name: `Contribution`,
                            field: 'amount',
                            formatField: civicFormat.dollars,
                          },
                          {
                            name: `Match`,
                            field: 'matchAmount',
                            formatField: d =>
                              d === 'N/A' ? 'N/A' : civicFormat.dollars(d),
                          },
                          {
                            name: `Type`,
                            field: 'contributionSubType',
                            formatField: civicFormat.titleCase,
                          },
                        ]}
                      />
                    </ScatterPlotMap>
                  ) : (
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
                  )}
                </BaseMap>
              </div>
              <div css={chartContainer}>
                <ContributionTypeBar
                  data={aggregatedContributorTypes}
                  count={selectedCount}
                />
                <ContributionTypePie
                  data={aggregatedDonationSize}
                  count={selectedCount}
                />
                <ContributorLocationBar
                  data={aggregatedContributionsByRegion}
                  count={selectedCount}
                />
              </div>
            </>
          )}
        </div>
      )}
      {selectedCompare &&
        selectedCampaignNames.length === campaignsTable.length && (
          <div css={compareVisualizationContainer(selectedCampaigns.length)}>
            {selectedCampaignNames.map((name, index) => (
              <>
                <div
                  css={css`
                    grid-column-start: ${index + 1};
                    grid-row-start: 1;
                  `}
                >
                  <h2
                    css={css`
                      display: flex;
                      justify-content: center;
                    `}
                  >
                    {campaignsTable[index].campaignName}
                  </h2>
                  <table css={table}>
                    <tr>
                      <th>Public Financing</th>
                      <td>{campaignsTable[index].participatingStatus}</td>
                    </tr>
                    <tr>
                      <th>Donors</th>
                      <td>{campaignsTable[index].donorsCount}</td>
                    </tr>
                    <tr>
                      <th>Median Contribution</th>
                      <td>
                        {civicFormat.dollars(
                          campaignsTable[index].medianContributionSize
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Total Contributions</th>
                      <td>
                        {civicFormat.dollars(
                          campaignsTable[index].totalAmountContributed
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Total Match Approved</th>
                      <td>
                        {campaignsTable[index].participatingStatus === '❌'
                          ? 'N/A'
                          : civicFormat.dollars(
                              campaignsTable[index].totalAmountMatched
                            )}
                      </td>
                    </tr>
                  </table>
                </div>
                <div
                  css={css`
                    grid-column-start: ${index + 1};
                    grid-row-start: 2;
                  `}
                >
                  <ContributionTypeBar
                    data={aggregatedContributorTypesByCandidate[index]}
                    count={selectedCount}
                  />
                </div>
                <div
                  css={css`
                    grid-column-start: ${index + 1};
                    grid-row-start: 3;
                  `}
                >
                  <ContributionTypePie
                    data={aggregatedDonationSizeByCandidate[index]}
                    count={selectedCount}
                  />
                </div>
                <div
                  css={css`
                    grid-column-start: ${index + 1};
                    grid-row-start: 4;
                  `}
                >
                  <ContributorLocationBar
                    data={aggregatedContributionsByRegionByCandidate[index]}
                    count={selectedCount}
                  />
                </div>
              </>
            ))}
          </div>
        )}
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
            // eslint-disable-next-line react/display-name
            components={{ Toolbar: () => <div /> }}
          />
        </>
      )}
      <MadeByFooter />
      <Modal
        customModalStyle={cookies.visited ? modalStyle : introModalStyle}
        onClose={() =>
          cookies.visited || setCookie('visited', 'yes', { path: '/' })
        }
      />
    </PageHoc>
  );
};

Home.propTypes = {
  aggregatedContributionsByRegion: PropTypes.arrayOf(PropTypes.shape({})),
  aggregatedContributorTypes: PropTypes.arrayOf(PropTypes.shape({})),
  aggregatedDonationSize: PropTypes.arrayOf(PropTypes.shape({})),
  aggregatedContributionsByRegionByCandidate: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape({}))
  ),
  aggregatedContributorTypesByCandidate: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape({}))
  ),
  aggregatedDonationSizeByCandidate: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape({}))
  ),
  allOffices: PropTypes.arrayOf(PropTypes.string),
  availableCampaignNames: PropTypes.arrayOf(PropTypes.string),
  availableCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      officeSought: PropTypes.string,
    })
  ),
  campaignsTable: PropTypes.arrayOf(PropTypes.shape({})),
  mapData: PropTypes.shape({}),
  request: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
  externalRequest: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
  resetAll: PropTypes.func,
  setCustomFilters: PropTypes.func,
  selectedCampaignNames: PropTypes.arrayOf(PropTypes.string),
  selectedCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      officeSought: PropTypes.string,
    })
  ),
  selectedCount: PropTypes.bool,
  selectedEndDate: PropTypes.shape({}),
  selectedOffices: PropTypes.arrayOf(PropTypes.string),
  selectedFinancing: PropTypes.string,
  selectedStartDate: PropTypes.shape({}),
  setDateRange: PropTypes.func,
  setSelectedCampaigns: PropTypes.func,
  setSelectedCount: PropTypes.func,
  setSelectedOffices: PropTypes.func,
  setSelectedFinancing: PropTypes.func,
  showModal: PropTypes.func,
  summaryData: PropTypes.shape({}),
  summaryDataByParticipation: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Home;
