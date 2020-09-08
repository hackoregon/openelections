/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
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
import { Filter1, Filter2, Filter3, Filter4 } from '@material-ui/icons';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
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
const scatterplotColor = { rgba: [35, 85, 44, 255], hex: '#0a471e' };
const alternateScatterplotColor = {
  rgba: [255, 170, 0, 255],
  hex: '#ffaa00',
};
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
    background: #f3f2f3;
  }

  .MuiInputBase-root,
  .MuiFormLabel-root {
    font-size: 1.2rem;
    color: #000;
  }

  .MuiSelect-selectMenu {
    max-width: 250px;
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

const largeCompareVisualizationContainer = rows => css`
  margin: 2rem 0;
  display: grid;
  grid-template-rows: repeat(4, auto);
  grid-template-columns: repeat(${rows}, auto);
  @media ${mediaQueryRanges.mediumAndDown} {
    display: none;
  }
`;

const mobileCompareVisualizationContainer = css`
  display: none;
  @media ${mediaQueryRanges.mediumAndDown} {
    display: grid;
    margin: 2rem 0.5em;
    display: grid;
    grid-template-rows: repeat(4, auto);
    grid-template-columns: repeat(1, auto);
    div {
      z-index: -1;
    }
  }
`;

const mobileOnlyToggle = css`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  margin: 2rem 0;
  text-align: center;
  div {
    background-color: white;
  }
  @media ${mediaQueryRanges.mediumAndUp} {
    display: none;
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

const table = css`
  margin: 1em auto 2em auto;
  border-spacing: 1em 0.25em;
  th {
    text-align: left;
  }
`;

const legendScatterplotFill = css`
  fill: black;
`;

const participantScatterplotFill = css`
  fill: ${scatterplotColor.hex};
`;

const nonParticipantScatterplotFill = css`
  fill: ${alternateScatterplotColor.hex};
`;

const noWrap = css`
  white-space: nowrap;
`;

const mapHeight = css`
  height: 700px;
  width: 100%;
`;

const buttonStyles = css`
  margin: 5px 5px !important;
`;

const resetButtonStyles = css`
  margin: 5px 5px !important;
  button {
    background-color: #c21f39 !important;
  }
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1em;
  filter: opacity(90%);
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
  resetAll,
  selectedCompare,
  campaignsTable,
  mapData,
  summaryDataByParticipation,
  showModal,
  setCustomFilters,
}) => {
  const [cookies, setCookie] = useCookies('visited');
  const [compare, setCompare] = React.useState(1);

  useEffect(() => {
    cookies.visited ||
      showModal({
        component: 'Info',
        props: {},
      });
  }, [showModal, cookies.visited]);

  const handleCompare = (event, newCompare) => {
    setCompare(newCompare);
  };

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

  const bracketFieldFootnote = field => row =>
    `${dollars(row[field].total)}${row.participatingStatus ? ' ' : '*'} (${
      row[field].contributions.length
    }${row.participatingStatus ? ' ' : '*'})`;

  const footnote = field => row =>
    `${row[field]}${row.participatingStatus ? ' ' : '*'}`;

  const dollarsFootnote = field => row =>
    `${dollars(row[field])}${row.participatingStatus ? ' ' : '*'}`;

  const columns = [
    {
      field: 'campaignName',
      title: 'Campaign',
    },
    {
      field: 'participatingStatus',
      title: 'OAE Participant',
      // eslint-disable-next-line react/display-name
      render: rowData =>
        rowData.participatingStatus ? (
          <div>
            <span css={noWrap}>
              <svg viewBox="0 0 10 10" width="10px">
                <circle cx="5" cy="5" r="5" css={participantScatterplotFill} />
              </svg>
              {` `}Participant
            </span>
          </div>
        ) : (
          <div>
            <span css={noWrap}>
              <svg viewBox="0 0 10 10" width="10px">
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  css={nonParticipantScatterplotFill}
                />
              </svg>
              {` `}Non-Participant
            </span>
          </div>
        ),
      sorting: false,
    },
    {
      field: 'officeSought',
      title: 'Office',
    },
    {
      field: 'donationsCount',
      title: 'Contributions',
      defaultSort: 'desc',
      render: footnote('donationsCount'),
      type: 'numeric',
    },
    {
      field: 'totalAmountContributed',
      title: 'Total Contributions',
      render: row => dollars(row.totalAmountContributed),
      type: 'currency',
    },
    {
      field: 'totalAmountMatched',
      title: 'Total Match Approved',
      render: row =>
        row.participatingStatus ? dollars(row.totalAmountMatched) : 'N/A',
      type: 'currency',
    },
    {
      title: 'Micro: <$25',
      render: bracketFieldFootnote('micro'),
      sorting: false,
    },
    {
      title: 'Small: $25-$100',
      render: bracketFieldFootnote('small'),
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
      title: 'OAE Participant',
      // eslint-disable-next-line react/display-name
      render: row =>
        row.participatingStatus ? (
          <div>
            <span css={noWrap}>
              <svg viewBox="0 0 10 10" width="10px">
                <circle cx="5" cy="5" r="5" css={participantScatterplotFill} />
              </svg>
              {` `}Participant
            </span>
          </div>
        ) : (
          <div>
            <span css={noWrap}>
              <svg viewBox="0 0 10 10" width="10px">
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  css={nonParticipantScatterplotFill}
                />
              </svg>
              {` `}Non-Participant
            </span>
          </div>
        ),
      sorting: false,
    },
    {
      field: 'campaignsCount',
      title: 'Campaigns',
      sorting: false,
      type: 'numeric',
    },
    {
      field: 'donationsCount',
      title: 'Contributions',
      sorting: false,
      type: 'numeric',
      render: footnote('donationsCount'),
    },
    {
      field: 'donorsCount',
      title: 'Donors',
      sorting: false,
      type: 'numeric',
      render: footnote('donorsCount'),
    },
    {
      field: 'medianContributionSize',
      title: 'Median Contribution',
      sorting: false,
      type: 'currency',
      render: dollarsFootnote('medianContributionSize'),
    },
    {
      field: 'totalAmountContributed',
      title: 'Total Contributions',
      sorting: false,
      type: 'currency',
      render: row => dollars(row.totalAmountContributed),
    },
    {
      field: 'totalAmountMatched',
      title: 'Total Match Approved',
      sorting: false,
      type: 'currency',
      render: row =>
        row.participatingStatus ? dollars(row.totalAmountMatched) : 'N/A',
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
              <Select
                value={selectedFinancing}
                onChange={event => setSelectedFinancing(event.target.value)}
              >
                <MenuItem value="public" css={formOption}>
                  participants
                </MenuItem>
                <MenuItem value="private" css={formOption}>
                  non-participants
                </MenuItem>
                <MenuItem value="all" css={formOption}>
                  participants & non-participants
                </MenuItem>
              </Select>
              <FormHelperText>
                Open and Accountable Elections (OAE)
              </FormHelperText>
            </FormControl>
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
                  selected.length > 0 && setSelectedFinancing('all');
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
          </h1>
          <div css={buttonWrapper}>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
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
                onClick={() => {
                  const monthAgo = new Date(timeLoaded);
                  monthAgo.setMonth(timeLoaded.getMonth() - 1);
                  setCustomFilters({
                    financing: 'all',
                    startDate: monthAgo,
                    endDate: timeLoaded,
                    compare: false,
                  });
                }}
              >
                Last Month
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
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
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Sarah Iannarone'
                      ),
                    ],
                    compare: false,
                  })
                }
              >
                Schoen for Mayor
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Ted Wheeler'
                      ),
                    ],
                    financing: 'private',
                    compare: false,
                  })
                }
              >
                Ted Wheeler
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
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
                Runoff: Commissioner 1
              </Button>
            </div>
            {/* <div css={buttonStyles}>
              <Button
                buttonType="small"
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Chloe Eudaly'
                      ),
                    ],
                    compare: false,
                  })
                }
              >
                Chloe Eudaly
              </Button>
            </div>
            <div css={buttonStyles}>
              <Button
                buttonType="small"
                onClick={() =>
                  setCustomFilters({
                    campaigns: [
                      availableCampaigns.find(
                        campaign => campaign.name === 'Mingus Mapps'
                      ),
                    ],
                    compare: false,
                  })
                }
              >
                Mingus Mapps
              </Button>
            </div>
            <div css={resetButtonStyles}>
              <Button buttonType="small" onClick={() => resetAll()}>
                Reset
              </Button>
            </div> */}
          </div>
          {!isLoading && (
            <div css={dataLoadedStyle}>
              Live data from Open and Accountable Elections retrieved on{' '}
              {format(timeLoaded, 'MMM DD, YYYY [a]t h:mm:ssa')}. Data loaded
              from ORESTAR for non-participating candidates may have up to a 12
              hour delay.
            </div>
          )}
        </FormGroup>
      </div>
      {!!summaryDataByParticipation && !selectedCompare && (
        <>
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
          <div css={dataLoadedStyle}>
            *Smaller contributions are bundled by ORESTAR for non-participating
            candidates.
          </div>
        </>
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
                            css={legendScatterplotFill}
                          />
                          <circle
                            cx="15"
                            cy="5"
                            r="2"
                            css={legendScatterplotFill}
                          />
                          <circle
                            cx="25"
                            cy="5"
                            r="3"
                            css={legendScatterplotFill}
                          />
                          <circle
                            cx="35"
                            cy="5"
                            r="4"
                            css={legendScatterplotFill}
                          />
                          <circle
                            cx="45"
                            cy="5"
                            r="5"
                            css={legendScatterplotFill}
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
          <div
            css={css`
              display: flex;
              justify-content: space-around;
              align-items: flex-start;
              flex-direction: column;
            `}
          >
            {selectedCampaignNames.length > 1 && (
              <div css={mobileOnlyToggle}>
                <ToggleButtonGroup
                  value={compare}
                  exclusive
                  onChange={handleCompare}
                  aria-label="campaign to compare"
                >
                  <ToggleButton value={1} aria-label="campaign 1">
                    <Filter1 />
                  </ToggleButton>
                  <ToggleButton value={2} aria-label="campaign 2">
                    <Filter2 />
                  </ToggleButton>
                  {selectedCampaignNames.length > 2 && (
                    <ToggleButton value={3} aria-label="campaign 3">
                      <Filter3 />
                    </ToggleButton>
                  )}
                  {selectedCampaignNames.length > 3 && (
                    <ToggleButton value={4} aria-label="campaign 4">
                      <Filter4 />
                    </ToggleButton>
                  )}
                </ToggleButtonGroup>
              </div>
            )}
            <div
              css={largeCompareVisualizationContainer(selectedCampaigns.length)}
            >
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
                        text-align: center;
                      `}
                    >
                      {campaignsTable[index].campaignName}
                    </h2>
                    <table css={table}>
                      <tr>
                        <th>OAE Participant</th>
                        <td>
                          {campaignsTable[index].participatingStatus
                            ? '✅'
                            : '❌'}
                        </td>
                      </tr>
                      <tr>
                        <th>Donors</th>
                        <td>
                          {campaignsTable[index].donationsCount}
                          {campaignsTable[index].participatingStatus
                            ? ' '
                            : '*'}
                        </td>
                      </tr>
                      <tr>
                        <th>Contributions</th>
                        <td>
                          {campaignsTable[index].donorsCount}
                          {campaignsTable[index].participatingStatus
                            ? ' '
                            : '*'}
                        </td>
                      </tr>
                      <tr>
                        <th>Median Contribution</th>
                        <td>
                          {civicFormat.dollars(
                            campaignsTable[index].medianContributionSize
                          )}
                          {campaignsTable[index].participatingStatus
                            ? ' '
                            : '*'}
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
                          {campaignsTable[index].participatingStatus
                            ? civicFormat.dollars(
                                campaignsTable[index].totalAmountMatched
                              )
                            : 'N/A'}
                        </td>
                      </tr>
                    </table>
                    {!campaignsTable[index].participatingStatus && (
                      <div
                        css={css`
                          ${dataLoadedStyle};
                          margin: -2em auto 1em auto;
                          text-align: center;
                        `}
                      >
                        *Smaller contributions are bundled by ORESTAR for
                        non-participating candidates.
                      </div>
                    )}
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
            <div css={mobileCompareVisualizationContainer}>
              <div
                css={css`
                  grid-column-start: 1;
                  grid-row-start: 1;
                `}
              >
                <h2
                  css={css`
                    display: flex;
                    justify-content: center;
                    text-align: center;
                  `}
                >
                  {campaignsTable[compare - 1].campaignName}
                </h2>
                <table css={table}>
                  <tr>
                    <th>OAE Participant</th>
                    <td>
                      {campaignsTable[compare - 1].participatingStatus
                        ? '✅'
                        : '❌'}
                    </td>
                  </tr>
                  <tr>
                    <th>Donors</th>
                    <td>{campaignsTable[compare - 1].donorsCount}</td>
                  </tr>
                  <tr>
                    <th>Donors</th>
                    <td>
                      {campaignsTable[compare - 1].donationsCount}
                      {campaignsTable[compare - 1].participatingStatus
                        ? ' '
                        : '*'}
                    </td>
                  </tr>
                  <tr>
                    <th>Median Contribution</th>
                    <td>
                      {civicFormat.dollars(
                        campaignsTable[compare - 1].medianContributionSize
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Contributions</th>
                    <td>
                      {civicFormat.dollars(
                        campaignsTable[compare - 1].totalAmountContributed
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Match Approved</th>
                    <td>
                      {campaignsTable[compare - 1].participatingStatus
                        ? civicFormat.dollars(
                            campaignsTable[compare - 1].totalAmountMatched
                          )
                        : 'N/A'}
                    </td>
                  </tr>
                </table>
                {!campaignsTable[compare - 1].participatingStatus && (
                  <div
                    css={css`
                      ${dataLoadedStyle};
                      margin: -2em auto 1em auto;
                    `}
                  >
                    *Smaller contributions are bundled by ORESTAR for
                    non-participating candidates.
                  </div>
                )}
              </div>
              <div
                css={css`
                  grid-column-start: 1;
                  grid-row-start: 2;
                `}
              >
                <ContributionTypeBar
                  data={aggregatedContributorTypesByCandidate[compare - 1]}
                  count={selectedCount}
                />
              </div>
              <div
                css={css`
                  grid-column-start: 1;
                  grid-row-start: 3;
                `}
              >
                <ContributionTypePie
                  data={aggregatedDonationSizeByCandidate[compare - 1]}
                  count={selectedCount}
                />
              </div>
              <div
                css={css`
                  grid-column-start: 1;
                  grid-row-start: 4;
                `}
              >
                <ContributorLocationBar
                  data={aggregatedContributionsByRegionByCandidate[compare - 1]}
                  count={selectedCount}
                />
              </div>
            </div>
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
          <div css={dataLoadedStyle}>
            *Smaller contributions are bundled by ORESTAR for non-participating
            candidates.
          </div>
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
  selectedCompare: PropTypes.bool,
  selectedEndDate: PropTypes.shape({}),
  selectedOffices: PropTypes.arrayOf(PropTypes.string),
  selectedFinancing: PropTypes.string,
  selectedStartDate: PropTypes.shape({}),
  setDateRange: PropTypes.func,
  setSelectedCampaigns: PropTypes.func,
  setSelectedCount: PropTypes.func,
  setSelectedOffices: PropTypes.func,
  setSelectedFinancing: PropTypes.func,
  resetAll: PropTypes.func,
  showModal: PropTypes.func,
  summaryData: PropTypes.shape({}),
  summaryDataByParticipation: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Home;
