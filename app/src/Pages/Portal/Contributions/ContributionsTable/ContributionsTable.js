import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
import { withRouter } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import FilterContribution from '../../../../components/Forms/FilterContributions/index';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';

import TablePagination from '../../../../components/Table/TablePagination';
import {
  getContributions,
  getContributionsList,
  getContributionsTotal,
} from '../../../../state/ducks/contributions';
import {
  isCampAdmin,
  isGovAdmin,
  isLoggedIn,
  getCurrentUserId,
} from '../../../../state/ducks/auth';
import { mediaQueryRanges } from '../../../../assets/styles/variables';

const columnInfo = (title, field, options) => ({ title, field, ...options });

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = isGovAdmin => {
  const cols = [
    {
      field: 'date',
      title: 'Date',
      render: rowData =>
        format(
          new Date(
            parseFromTimeZone(rowData.date, { timeZone: 'America/Los_Angeles' })
          ),
          'MM-DD-YYYY'
        ),
    },
    {
      field: 'name',
      title: 'Name',
      sorting: false,
      render: rowData => {
        if (
          rowData.contributorType === 'individual' ||
          rowData.contributorType === 'family'
        ) {
          return `${rowData.firstName} ${rowData.lastName}`;
        }
        return rowData.name;
      },
    },
    columnInfo('Amount', 'amount', { type: 'currency', sorting: false }),
    columnInfo('Status', 'status'),
    // columnInfo("Labels", "NotSet")
  ];

  if (isGovAdmin)
    cols.splice(1, 0, {
      field: 'campaign',
      title: 'Campaign',
      sorting: false,
      render: rowData => {
        return rowData && rowData.campaign
          ? rowData.campaign.name
          : 'Loading...';
      },
    });

  return cols;
};

const ContributionsTable = ({ ...props }) => {
  const [sortFilter, setSortFilter] = useState({
    sort: {
      field: 'date',
      direction: 'DESC',
    },
  });
  const [filterOptions, setFilterOptions] = useState({});
  const [paginationOptions, setPaginationOptions] = useState({
    perPage: 50,
    page: 0,
  });

  const isLoading =
    props.isListLoading && !Array.isArray(props.contributionList);

  const options = {
    pageSize: paginationOptions.perPage,
    showTitle: false,
  };

  const actions = [
    actionInfo('View', 'primary', (event, rowData) => {
      props.history.push(`/contributions/${rowData.id}`);
    }),
  ];

  // eslint-disable-next-line no-use-before-define
  let urlQuery = getQueryParams(props.location);

  const components = {
    // eslint-disable-next-line react/display-name
    Action: props => (
      <Button
        onClick={event => props.action.onClick(event, props.data)}
        buttonType={props.action.buttonType}
      >
        {props.action.name}
      </Button>
    ),
  };

  const title = `${props.total} Contributions`;

  return (
    <PageHoc>
      <h1>Contributions</h1>
      <FilterContribution
        onFilterUpdate={newFilterOptions => {
          urlQuery = newFilterOptions;
          setFilterOptions(newFilterOptions);

          props.history.push(
            // eslint-disable-next-line no-use-before-define
            `${props.location.pathname}?${makeIntoQueryParams(urlQuery)}`
          );
          // eslint-disable-next-line no-use-before-define
          fetchList(newFilterOptions, sortFilter, { page: 0 });
        }}
      />
      <Table
        isLoading={isLoading}
        title={title}
        columns={columns(props.isGovAdmin)}
        options={options}
        actions={actions}
        components={components}
        data={props.contributionList}
        onOrderChange={(item, direction) => {
          const column = columns(props.isGovAdmin)[item];
          let sortOptions = {};
          if (column) {
            sortOptions = {
              sort: {
                field: column.field,
                direction: direction.toUpperCase(),
              },
            };
          }

          setSortFilter(sortOptions);
          // eslint-disable-next-line no-use-before-define
          fetchList(filterOptions, sortOptions, paginationOptions);
        }}
        perPage={paginationOptions.perPage}
        pageNumber={paginationOptions.page}
        totalRows={props.total}
        // eslint-disable-next-line no-use-before-define
        onChangePage={handleOnChangePage}
        // eslint-disable-next-line no-use-before-define
        onChangeRowsPerPage={handleOnRowsPerPageChange}
        toolbarAction={
          !props.isGovAdmin ? (
            <Button
              buttonType="primary"
              onClick={() =>
                props.history.push({ pathname: '/contributions/add' })
              }
            >
              Add New Contribution
            </Button>
          ) : null
        }
      />
    </PageHoc>
  );

  function handleOnChangePage(e, newPage) {
    const newPaginationOptions = {
      page: newPage,
      perPage: paginationOptions.perPage,
    };

    setPaginationOptions(newPaginationOptions);
    // eslint-disable-next-line no-use-before-define
    fetchList(filterOptions, sortFilter, newPaginationOptions);
  }

  function handleOnRowsPerPageChange(e) {
    const perPage = Number(e.target.value);
    const newPaginationOptions = {
      perPage,
      page: 0,
    };
    setPaginationOptions(newPaginationOptions);
    // eslint-disable-next-line no-use-before-define
    fetchList(filterOptions, sortFilter, newPaginationOptions);
  }

  function fetchList(filterOptions, sortOptions, paginationOptions) {
    const data = {
      governmentId: props.govId,
      currentUserId: props.userId,
      campaignId: props.campaignId,
      ...paginationOptions,
      ...filterOptions,
      ...sortOptions,
    };
    props.getContributions(data);
  }
};

function getQueryParams(location) {
  const rawParams = location.search.replace(/^\?/, '');
  const result = {};

  rawParams.split('&').forEach(item => {
    if (item) {
      const [key, val] = item.split('=');
      result[key] = val;
    }
  });

  return result;
}

function makeIntoQueryParams(paramsObject) {
  return Object.keys(paramsObject)
    .map(param => `${param}=${paramsObject[param]}`)
    .join('&');
}

export default connect(
  state => ({
    isCampAdmin: isCampAdmin(state),
    isGovAdmin: isGovAdmin(state),
    isListLoading: state.campaigns.isLoading,
    contributionList: getContributionsList(state),
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: getCurrentUserId(state),
    total: state.contributions.total,
  }),
  dispatch => {
    return {
      getContributions: data => dispatch(getContributions(data)),
    };
  }
)(withRouter(ContributionsTable));
