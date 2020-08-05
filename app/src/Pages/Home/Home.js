/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars
import React, { useState, useEffect } from 'react';
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
} from '@hackoregon/component-library';
import { scaleQuantize } from 'd3-scale';
import { useCookies } from 'react-cookie';
import { uniqBy } from 'lodash';

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
const scatterplotColor = { rgba: [35, 85, 44, 255], hex: '#23552c' };
const screenGridColorRange = VisualizationColors.sequential.ocean;

const filterWrapper = css`
  top: 0;
  z-index: 9999;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
  justify-items: start;
  margin: 0 auto;
  padding: 0 1em;
  border: 1px solid rgb(224, 224, 224);
  background-color: #f9f9f9;
  @media ${mediaQueryRanges.mediumAndUp} {
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

const buttonStyles = css`
  margin: 0 5px !important;
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  @media screen and (max-width: 600px) {
    margin-top: 1em;
    margin-bottom: 1em;
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
  allOffices,
  availableCampaigns,
  availableCampaignNames,
  aggregatedContributorTypes,
  aggregatedDonationSize,
  aggregatedContributionsByRegion,
  selectedOffices,
  selectedStartDate,
  selectedEndDate,
  setSelectedOffices,
  selectedCampaigns,
  selectedCampaignNames,
  setSelectedCampaigns,
  setDateRange,
  selectedCount,
  setSelectedCount,
  campaignsTable,
  mapData,
  summaryData,
  showModal,
}) => {
  const [cookies, setCookie] = useCookies('visited');

  useEffect(() => {
    cookies.visited ||
      showModal({
        component: 'Info',
        props: {},
      });
  }, [showModal, cookies.visited]);

  const isLoading = request ? request.isLoading : true;
  const error = request && request.error;
  const timeLoaded = request && request.timeLoaded;

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
      <div css={filterWrapper}>
        <FormGroup row css={formStyles}>
          <h1>
            Contributions for
            <FormControl className="form-control">
              <InputLabel id="filter-offices-label">
                {`${selectedOffices && selectedOffices.length ? '' : 'all '}`}
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
                    <Checkbox
                      checked={
                        selectedOffices && selectedOffices.indexOf(name) > -1
                      }
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Limit by position</FormHelperText>
            </FormControl>
            ,
            <FormControl className="form-control">
              <InputLabel id="filter-campaigns">
                {`${
                  selectedCampaignNames && selectedCampaignNames.length
                    ? ''
                    : 'all '
                }`}
                campaigns
              </InputLabel>
              <Select
                multiple
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
                  selected.map(campaign => campaign).join(', ')
                }
              >
                {availableCampaignNames.map(campaign => (
                  <MenuItem key={campaign} value={campaign} css={formOption}>
                    <Checkbox
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
            by
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
          {!isLoading && (
            <div css={dataLoadedStyle}>
              Live data from Open and Accountable Elections retrieved on{' '}
              {format(timeLoaded, 'MMM DD, YYYY [a]t h:mm:ssa')}.
              Non-participating candidates not shown. Contributions over $250
              are either seed or in-kind contributions.
            </div>
          )}
        </FormGroup>
        <div css={buttonWrapper}>
          <div css={buttonStyles}>
            <Button
              css={buttonStyles}
              onClick={() => {
                showModal({
                  component: 'Info',
                  props: {},
                });
              }}
            >
              Info
            </Button>
          </div>
        </div>
      </div>
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
                      primaryName="Campaign"
                      primaryField="campaignName"
                      secondaryName="Contribution"
                      secondaryField="amount"
                    />
                  </ScatterPlotMap>
                ) : (
                  <div />
                )}
                {selectedCount ? (
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
  request: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
  allOffices: PropTypes.arrayOf(PropTypes.string),
  availableCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default Home;
